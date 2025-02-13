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

CREATE TABLE Articles (
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  authorId INTEGER NOT NULL,
  username TEXT NOT NULL,
  article_title TEXT NOT NULL,
  createdAt TEXT DEFAULT (DATETIME('now', 'localtime')),
  content TEXT NOT NULL,
  FOREIGN KEY (authorId) REFERENCES Users(id) ON DELETE CASCADE,
  FOREIGN KEY (username) REFERENCES Users(username) ON DELETE CASCADE
);

CREATE TABLE Comments (
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  articleId  INTEGER NOT NULL,
  userId INTEGER NOT NULL, 
  parentId INTEGER DEFAULT NULL, 
  content TEXT NOT NULL, 
  createdAt DATETIME DEFAULT (DATETIME('now', 'localtime')), 
  FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE, 
  FOREIGN KEY (articleId) REFERENCES Articles(id) ON DELETE CASCADE,
  FOREIGN KEY (parentId) REFERENCES Comments(id) ON DELETE CASCADE
);

CREATE TABLE Likes (
    user_id INTEGER NOT NULL,
    article_id INTEGER NOT NULL,
    PRIMARY KEY (user_id, article_id),  -- 复合主键，防止重复点赞
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (article_id) REFERENCES Articles(id) ON DELETE CASCADE
);


INSERT INTO Users (username, password, realName, birthDate, blurb, isManager, imageLink) VALUES
('SuperGaoye', 'gaoye12345', 'Gaoye Super', '1990-05-14', 'Hi, I am gaoye, I am a manager for this website!', 1, 'Super.jpg'),
('NanaDreamer', 'password456', 'Nana Kudo', '1993-07-22', 'Lover of books and art.', 0, 'pokomen.png'),
('CoderZ', 'password789', 'Zhang Wei', '1988-11-30', 'Tech geek and AI explorer.', 0, 'pokomen1.png'),
('CreativeMax', 'password000', 'Max Li', '1995-01-15', 'A writer and gamer at heart.', 0, 'pokomen2.png'),
('AlexGamer21', 'gamer123', 'Alex Chen', '1992-03-10', 'Avid gamer with a passion for strategy games.', 0, 'pokomen3.png'),
('TechieTina', 'tina456', 'Tina Zhang', '1994-06-17', 'Technology lover and aspiring software engineer.', 0, 'pokomen4.png'),
('BookwormLeo', 'leo789', 'Leo Wang', '1991-08-22', 'Book lover, especially fantasy and sci-fi novels.', 0, 'pokomen5.png'),
('MusicFanJane', 'jane321', 'Jane Liu', '1990-12-05', 'Music enthusiast, with a special love for classical piano.', 0, 'pokomen.png'),
('ArtisticXia', 'xia654', 'Xia Wu', '1996-11-18', 'Art is my life, from painting to sculpture.', 0, 'pokomen.png'),
('EcoWarriorElla', 'ella987', 'Ella Li', '1993-09-30', 'Environmental advocate, passionate about sustainability.', 0, 'pokomen.png');

