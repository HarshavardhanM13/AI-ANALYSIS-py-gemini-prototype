


# connect with mysql useing connector 

import mysql.connector
from config import DB_Config

def get_connection():
    connection = mysql.connector.connect(**DB_Config)
    return connection