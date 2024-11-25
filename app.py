from flask import Flask, redirect, url_for, session
from authlib.integrations.flask_client import OAuth
import os
from dotenv import load_dotenv


# Flask App Configuration
app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', os.urandom(24))  # Secure key for session management

# OAuth Setup for Cognito
oauth = OAuth(app)
oauth.register(
    name='oidc',
    authority='https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_sQunBxjQf',
    client_id='3h790bho4eq9je3ofgeuih854b',
    client_secret=os.getenv('CLIENT_SECRET'),
    server_metadata_url='https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_sQunBxjQf/.well-known/openid-configuration',
    client_kwargs={'scope': 'email openid phone'}
)

# Home Page
@app.route('/')
def index():
    user = session.get('user')
    if user:
        return f'Hello, {user["email"]}. <a href="/logout">Logout</a>'
    else:
        return f'Welcome! Please <a href="/login">Login</a>.'

# Login Route
@app.route('/login')
def login():
    # Redirect to Cognito for authentication
    redirect_uri = url_for('authorize', _external=True)
    return oauth.oidc.authorize_redirect(redirect_uri)

# Authorize Route (Post-login callback)
@app.route('/authorize')
def authorize():
    token = oauth.oidc.authorize_access_token()  # Fetch access token
    user = token['userinfo']  # Retrieve user info from Cognito
    session['user'] = user  # Store user info in session
    return redirect(url_for('index'))

# Logout Route
@app.route('/logout')
def logout():
    session.pop('user', None)  # Clear session data
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True)
