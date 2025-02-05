DROP TABLE IF EXISTS Users;

CREATE TABLE Users (
    id INTEGER NOT NULL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    realName TEXT NOT NULL,
    birthDate DATE NOT NULL,
    blurb TEXT
);


INSERT INTO Users (username, password, realName, birthDate, blurb) VALUES
    ('ketchumall', '12345', 'Ash Ketchum', '1990-05-22', 'Hey there! I am Ash Ketchum from Pallet Town, dreaming of becoming a Pokémon Master.'),
    ('pokemondoctor', '67890', 'Joy Nurtureheart', '1985-03-15', 'I am Nurse Joy, devoted to nurturing and healing Pokémon at the Pokémon Center.'),
    ('growlitheisbae', 'pa55word', 'Jenny Ironwill', '1992-07-11', 'I am Officer Jenny, upholding peace and protecting Pokémon with my Growlithe.'),
    ('1514eva', 'pokeman', 'Samuel Oak', '1950-09-14', 'I am Professor Oak, passionate about Pokémon research and helping young trainers.');
