DROP TABLE IF EXISTS Users;

CREATE TABLE Users (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    realName TEXT NOT NULL,
    birthDate DATE NOT NULL,
    blurb TEXT,
    isManager INTEGER DEFAULT 0,
    imageLink TEXT
);

INSERT INTO Users (username, password, realName, birthDate, blurb, isManager, imageLink) VALUES
    ('SuperGaoye', 'gaoye12345', 'gaoye', '2025-05-22', 'Hey there! I am gaoye, and I am a foodie! Also, I am a manager of this website', 1,'/default_img/Super.jpg'),
    ('ketchumall', '12345', 'Ash Ketchum', '1990-05-22', 'Hey there! I am Ash Ketchum from Pallet Town, dreaming of becoming a Pokémon Master.', 0,'/default_img/pokomen.png'),
    ('pokemondoctor', '67890', 'Joy Nurtureheart', '1985-03-15', 'I am Nurse Joy, devoted to nurturing and healing Pokémon at the Pokémon Center.', 0,'/default_img/pokomen2.png'),
    ('growlitheisbae', 'pa55word', 'Jenny Ironwill', '1992-07-11', 'I am Officer Jenny, upholding peace and protecting Pokémon with my Growlithe.', 0,'/default_img/pokomen3.png'),
    ('1514eva', 'pokeman', 'Samuel Oak', '1950-09-14', 'I am Professor Oak, passionate about Pokémon research and helping young trainers.', 0,'/default_img/pokomen4.png'),
    ('mistyfan', 'watergym', 'Misty Waterflower', '1994-06-01', 'I am Misty, the Cerulean City Gym Leader, specializing in Water-type Pokémon.', 0,'/default_img/pokomen5.png');