from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS, cross_origin
from dotenv import load_dotenv
import os
import sqlite3
import random
import uuid
import jwt
import datetime

# Load in .env
load_dotenv()
# Create the Flask app
app = Flask(__name__, static_folder='static')


ALLOW_CORS_URLS = ['https://geoquizgame.xyz', 'https://www.geoquizgame.xyz']
BASE_URL = 'https://geoquizgame.xyz/'

# Enable CORS
CORS(app, resources={"/api/*": {"origins": ALLOW_CORS_URLS}})

# REST API

# Route: Link
# Methods: POST
@app.route('/api/link', methods=['POST'])
def getLink():

    # Parameters/info required in request message: Difficulty, Game_mode
    try:
        data = request.get_json()
        if data['Difficulty'] in ['Easy', 'Medium', 'Hard']:
            difficulty = data['Difficulty']
        else:
            raise ValueError
        if data['Game_mode'] in ['World', 'USA', 'Russia', 'China', 'Europe', 'Africa']:
            gameMode = data['Game_mode']
        else:
            raise ValueError
    except:
        return 'Bad request', 400
    
    if gameMode != 'World':
        return 'Game mode coming soon', 404
    
    # Query the database on the appropriate table according to the game mode WHERE difficulty = request.difficulty
    connection = sqlite3.connect('database.db')
    connection.row_factory = sqlite3.Row
    cursor = connection.cursor()

    try:
        with connection: # Safe from SQL injection because gameMode variable can only be one of our prepared statements
            if difficulty == 'Easy':
                cursor.execute("""SELECT id FROM {} WHERE {} = "Easy";""".format(gameMode, gameMode + '.difficulty'))
            elif difficulty == 'Medium':
                cursor.execute("""SELECT id FROM {} WHERE {} != "Hard";""".format(gameMode, gameMode + '.difficulty'))
            elif difficulty == 'Hard':
                cursor.execute("""SELECT id FROM {};""".format(gameMode))
            results = cursor.fetchall()
        
        # Create a list of 5 countries and a unique code corresponding to those 5 countries in that order
        itemsForGame = []
        while len(itemsForGame) < 5:
            item = random.choice(results)['id']
            if item not in itemsForGame:
                itemsForGame.append(item)
        itemsId = uuid.uuid4().hex

        # Store this unique code + countries in the links table
        with connection:
            cursor.execute("""
                INSERT INTO Links (link, item_1, item_2, item_3, item_4, item_5, difficulty, game_mode)
                VALUES (
                    :link,
                    :item1,
                    :item2,
                    :item3,
                    :item4,
                    :item5,
                    :difficulty,
                    :game_mode
                )
            """, {
                'link':itemsId, 
                'item1':itemsForGame[0], 
                'item2':itemsForGame[1], 
                'item3':itemsForGame[2], 
                'item4':itemsForGame[3], 
                'item5':itemsForGame[4],
                'difficulty':difficulty,
                'game_mode':gameMode
            })
            cursor.execute("""SELECT * FROM Links WHERE Links.link = :id""", {'id':itemsId})
            link = cursor.fetchone()['link']

        connection.close()
        uniqueLink = BASE_URL + 'play/' + link
        return jsonify({'Link':uniqueLink})
    except:
        connection.close()
        return 'Server error', 500


# Route: Play
# Methods: POST
@app.route('/api/play', methods=['POST'])
def getGameFromLink():

    # Parameters/info required in request message: unique code
    try:
        data = request.get_json()
        if data['Unique code']:
            unique_code = data['Unique code']
    except:
        return 'Bad request', 400

    # Find the game associated with the unique code in the database
    connection = sqlite3.connect('database.db')
    connection.row_factory = sqlite3.Row
    cursor = connection.cursor()
    with connection:
        cursor.execute("""SELECT * FROM Links WHERE Links.link = :id""", {'id':unique_code})
        result = cursor.fetchone()
    try:
        game = False
        if result['link'] == unique_code:
            game = result
        if game == False:
            raise IndexError
        else:
            # Generate a session id
            sessionId = uuid.uuid4().hex
            
            # Set the session details
            if game['difficulty'] == 'Easy':
                cluesLimit = 50
            elif game['difficulty'] == 'Medium':
                cluesLimit = 40
            elif game['difficulty'] == 'Hard':
                cluesLimit = 30
            
            cluesRemaining = cluesLimit
            current_score = 0
            current_round = 1
            
            # First clue is a photo (client side needs to keep track of which photos have already been sent)
            with connection:
                cursor.execute("""
                    SELECT photo_name FROM World_photos WHERE World_photos.photo_country = :id;
                """, {'id':game['item_1']})
                results = cursor.fetchall()
                clue = random.choice(results)['photo_name']

            date_created = datetime.date.today().isoformat()
            cluesGivenThisRound = ''
            
            # Establish a new session, store it in the DB
            with connection:
                cursor.execute("""
                    INSERT INTO Sessions (id, game, round, score, cluesRemaining, cluesLimit, Date_created, cluesGivenThisRound)
                    VALUES (
                        :id,
                        :game,
                        :round,
                        :score,
                        :cluesRemaining,
                        :cluesLimit,
                        :Date_created,
                        :cluesGivenThisRound
                    );
                """, {
                    'id':sessionId,
                    'game':unique_code,
                    'round':1,
                    'score':0,
                    'cluesRemaining':cluesRemaining,
                    'cluesLimit':cluesLimit,
                    'Date_created':date_created,
                    'cluesGivenThisRound':cluesGivenThisRound
                })

            # Generate a JWT
            token = str(jwt.encode({'sessionID':sessionId}, os.environ.get('APP_SECRET_FOR_JWT'), algorithm='HS256')).replace("b'", '').replace("'", '')
            response = {
                        'clue':clue, 
                        'round':current_round, 
                        'score':current_score, 
                        'cluesRemaining':cluesRemaining, 
                        'cluesLimit':cluesLimit,
                        'token':token,
                        'game_mode':game['game_mode']
                        }
            
            connection.close()
            # Return
            return jsonify(response)
    except:
        connection.close()
        return 'Bad request', 400


# Route: Clue
# Methods: POST
@app.route('/api/clue', methods=['POST'])
def getNextClue():

    # Parameters/info required in request message: session cookie/token, clue requested, and if the clue is a photo, alreadySentPhotos (a list)
    try:
        data = request.get_json()
        if data['token'] and data['clueType']:
            token = jwt.decode(data['token'], os.environ.get('APP_SECRET_FOR_JWT'), algorithms=['HS256'])
            clueType = data['clueType']
    except:
        return 'Bad request', 400
    
    connection = sqlite3.connect('database.db')
    connection.row_factory = sqlite3.Row
    cursor = connection.cursor()

    try:
        # Get the session
        with connection:
            cursor.execute("""
                SELECT * FROM Sessions
                WHERE Sessions.id = :id;
            """, {'id':token['sessionID']})
            result = cursor.fetchone()
            cluesRemaining = result['cluesRemaining']
            cluesGivenThisRound = result['cluesGivenThisRound']
    except:
        return 'Invalid session token', 403
    
    try:
        # Check that the player still has guesses left
        if cluesRemaining > 0 and result['id'] == token['sessionID']:
            gameID = result['game']
            roundNum = result['round']

            # Get the game that the player is playing
            with connection:
                cursor.execute("""
                    SELECT * FROM Links WHERE Links.link = :gameid;
                """, {'gameid':gameID})
                result = cursor.fetchone()
            currentRoundId = result['item_' + str(roundNum)]

            # If they want a photo
            if clueType == 'Photo':
                with connection:
                    cursor.execute("""
                        SELECT photo_name FROM World_photos WHERE World_photos.photo_country = :id;
                    """, {'id':currentRoundId})
                    results = cursor.fetchall()
                    clue = random.choice(results)['photo_name']
                    if len(data['Previous photo clues']) >= len(results):
                        raise ValueError
                    if clue in data['Previous photo clues']:
                        while clue in data['Previous photo clues']:
                            clue = random.choice(results)['photo_name']

            # If they want something that isnt a photo
            elif clueType in ['education_spending', 'gdp_per_capita', 'gdp_growth_rate', 
                                'life_expectancy', 'area', 'value_of_exports', 'religion', 'region', 
                                'population', 'currency', 'average_temp', 'capital', 'hdi', 'flag', 
                                'languages', 'military_spending']:
                with connection:
                    cursor.execute("""
                        SELECT {} FROM World WHERE World.id = :desiredid;
                    """.format(clueType), {'desiredid':currentRoundId})
                    result = cursor.fetchone()
                    clue = result[clueType]
            else:
                raise ValueError

            # Increment clues remaining, cluesGivenThisRound
            cluesGivenThisRound = cluesGivenThisRound + '1' + clueType
            with connection:
                cursor.execute("""
                    UPDATE Sessions SET cluesRemaining = :newValue, cluesGivenThisRound = :newValue2 WHERE id = :id;
                """, {
                    'newValue':cluesRemaining - 1,
                    'newValue2':cluesGivenThisRound,
                    'id':token['sessionID']
                })
                cursor.execute("""
                    SELECT * FROM Sessions WHERE Sessions.id = :id;
                """, {
                    'id':token['sessionID']
                })
                result = cursor.fetchone()
                if not (result['cluesRemaining'] == cluesRemaining - 1 and result['id'] == token['sessionID']):
                    raise ValueError

            # Return the clue
            connection.close()
            return jsonify({'clue':clue})
        
        else:
            raise ValueError
    except:
        connection.close()
        return 'Could not give you another clue', 400


# Route: Guess
# Methods: POST
@app.route('/api/guess', methods=['POST'])
def makeGuess():

    # Parameters/info required in request message: session cookie/token, guess
    try:
        data = request.get_json()
        if data['Guess'] and data['token']:
            guess = data['Guess']
            sessionID = jwt.decode(data['token'], os.environ.get('APP_SECRET_FOR_JWT'), algorithms=['HS256'])['sessionID']
    except:
        return 'Bad request', 400
    

    connection = sqlite3.connect('database.db')
    connection.row_factory = sqlite3.Row
    cursor = connection.cursor()

    try:
        # Find the country for the guess in the database
        with connection:
            cursor.execute("""
                SELECT * FROM World WHERE World.country = :country;
            """, {
                'country':guess
            })
            result = cursor.fetchone()
            if result['country'] == guess:
                guess = result


        # Find the session in the database, check if the guess is correct
        with connection:
            # Get session
            cursor.execute("""
                SELECT * FROM Sessions WHERE Sessions.id = :id
            """, {'id':sessionID})
            result = cursor.fetchone()
            if result['id'] == sessionID:
                session = result
            else:
                raise ValueError
            # Get game and check whether guess is true
            cursor.execute("""
                SELECT * FROM Links WHERE Links.link = :id
            """, {'id':session['game']})
            result = cursor.fetchone()
            if result['item_' + str(session['round'])] == guess['id']:
                correct = True
            else:
                correct = False
            game = result
            # Get the correct answer's country details
            cursor.execute("""
                SELECT * FROM World WHERE World.id = :id
            """, {
                'id': game['item_' + str(session['round'])]
            })
            result = cursor.fetchone()
            correctAnswer = result

        # Calculate the score, return whether the guess is true or false, increment the round and return the next clue
        scoreValuesDict = {
            'Photo':1,
            'gdp_growth_rate':1,
            'population':2,
            'languages':2,
            'region':2,
            'religion':2,
            'capital':3,
            'education_spending':1,
            'military_spending':1,
            'gdp_per_capita':2,
            'flag':3,
            'hdi':1,
            'life_expectancy':1,
            'area':1,
            'value_of_exports':1,
            'currency':2,
            'average_temp':2
        }
        listOfUsedClues = session['cluesGivenThisRound'].split('1')
        scoreToDeduct = 0
        for item in listOfUsedClues:
            if item != '':
                scoreToDeduct += scoreValuesDict[item]
        if correct:
            score = session['score'] + 50 - scoreToDeduct
        else:
            score = session['score']

        if session['round'] == 5:
            
            # Calculate the final score
            final_score = score * ((session['cluesRemaining'] + session['cluesLimit']) / float(session['cluesLimit']))
            
            # Check it against the high scores
            with connection:
                scoreID = uuid.uuid4().hex
                cursor.execute("""
                    SELECT * FROM Leaderboard WHERE Leaderboard.game_mode = :game_mode AND Leaderboard.difficulty = :difficulty ORDER BY score DESC LIMIT 5;
                """, {
                    'game_mode':game['game_mode'],
                    'difficulty':game['difficulty']
                })
                leaderboard = cursor.fetchall()
                highscore = False
                if len(leaderboard) > 0: # Maybe the leaderboard is None?
                    for item in leaderboard:
                        if final_score > item['score']:
                            highscore = True
                    
                # Insert it into the leaderboard
                cursor.execute("""
                    INSERT INTO Leaderboard (id, score, game_mode, difficulty) VALUES (:id, :score, :gameMode, :difficulty);
                """, {
                    'id':scoreID,
                    'score':final_score,
                    'gameMode':game['game_mode'],
                    'difficulty':game['difficulty']
                })

            connection.close()
            return jsonify({
                'correct':correct, 
                'final_score':final_score, 
                'leaderboard':[x['score'] for x in leaderboard], 
                'highscore':highscore,
                'correctAnswerValues': {
                    'capital': correctAnswer['capital'],
                    'flag': correctAnswer['flag'],
                    'country': correctAnswer['country']
                },
                'yourGuessValues': {
                    'capital': guess['capital'],
                    'flag': guess['flag'],
                    'country': guess['country']
                }
            })

        elif session['round'] in [1, 2, 3, 4]:

            # Update the session
            with connection:
                cursor.execute("""
                    UPDATE Sessions SET round = :nextround, score = :newScore, cluesGivenThisRound = '' WHERE Sessions.id = :id;
                """, {
                    'nextround':session['round'] + 1,
                    'newScore':score,
                    'id':session['id']
                })

            # Get first clue for the next round
            with connection:
                cursor.execute("""
                    SELECT photo_name FROM World_photos WHERE World_photos.photo_country = :id;
                """, {'id':game['item_' + str(session['round'] + 1)]})
                results = cursor.fetchall()
                clue = random.choice(results)['photo_name']

            # Return whether the guess was true or false and the first clue for the next round
            response = {
                'clue':clue, 
                'correct':correct,
                'correctAnswerValues': {
                    'capital': correctAnswer['capital'],
                    'flag': correctAnswer['flag'],
                    'country': correctAnswer['country']
                },
                'yourGuessValues': {
                    'capital': guess['capital'],
                    'flag': guess['flag'],
                    'country': guess['country']
                },
                'round':session['round'] + 1, 
                'score':score, 
                'cluesRemaining':session['cluesRemaining'], 
                'cluesLimit':session['cluesLimit'],
                'token':data['token']
            }

            connection.close()
            return jsonify(response)
        
        else:
            raise ValueError
    except:
        connection.close()
        return 'Bad request', 400


# 404 all other paths
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return 'Bad request', 404


if __name__ == '__main__':
    app.run('localhost', port=3001, debug=True, load_dotenv=True)


# Run a cleanup operation on the DB every two days https://stackoverflow.com/questions/27149386/issue-when-running-schedule-with-flask

# Pseudocode

# Route: Link
# Methods: GET
# Parameters/info required in request message: Difficulty, game mode
# Query the database on the appropriate table according to the game mode WHERE difficulty = request.difficulty
# Create a list of 5 countries and a unique code corresponding to those 5 countries in that order
# Store this list of unique code + countries in the links table
# Send the link back

# Route: Play
# Methods: POST
# Parameters/info required in request message: unique code (from url params)
# Find the game associated with the unique code in the database
# Return the first clue and establish a new session, store it in the DB

# Route: Clue
# Methods: GET
# Parameters/info required in request message: session cookie/token, clue requested, and if the clue is a photo, Previous photo clues (a list)
# If the person has run out of clues, return false
# Else return the clue they asked for (no need to keep track of which clues have already been requested, if a malicious user had access to someones token they could still waste clues anyway)

# Route: Guess
# Methods: POST
# Parameters/info required in request message: session cookie/token, guess, all of the clues (eg: population: 120130). The values are taken as proof that the clues are known.
# Check if the guess is correct or not
# If the guess is correct, calculate the score
# Update the score in the database
# If we are in the final round, check the updated score against the leaderboard for that difficulty/game mode combination
    # If the score is higher than the top 3, add it to the high scores
        # Return the score and a congrats message and the updated highscore leaderboard
    # Else
        # Return the score and the highscore leaderboard
# Else if we are not in the last round
    # Return the score and the first clue for the next round