CREATE USER 'AcadTrack'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON acadtrack.* TO 'AcadTrack'@'localhost';
FLUSH PRIVILEGES;