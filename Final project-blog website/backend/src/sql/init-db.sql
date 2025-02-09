DROP TABLE IF EXISTS Users;

CREATE TABLE Users (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    realName TEXT NOT NULL,
    birthDate DATE NOT NULL,
    blurb TEXT,
    isManager INTEGER DEFAULT 0
);

INSERT INTO Users (username, password, realName, birthDate, blurb, isManager) VALUES
    ('SuperGaoye', 'gaoye12345', 'gaoye', '2025-05-22', 'Hey there! I am gaoye, and I am a foodie! Also, I am a manager of this website', 1),
    ('ketchumall', '12345', 'Ash Ketchum', '1990-05-22', 'Hey there! I am Ash Ketchum from Pallet Town, dreaming of becoming a Pokémon Master.', 0),
    ('pokemondoctor', '67890', 'Joy Nurtureheart', '1985-03-15', 'I am Nurse Joy, devoted to nurturing and healing Pokémon at the Pokémon Center.', 0),
    ('growlitheisbae', 'pa55word', 'Jenny Ironwill', '1992-07-11', 'I am Officer Jenny, upholding peace and protecting Pokémon with my Growlithe.', 0),
    ('1514eva', 'pokeman', 'Samuel Oak', '1950-09-14', 'I am Professor Oak, passionate about Pokémon research and helping young trainers.', 0),
    ('mistyfan', 'watergym', 'Misty Waterflower', '1994-06-01', 'I am Misty, the Cerulean City Gym Leader, specializing in Water-type Pokémon.', 0);


CREATE TABLE Articles (
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  authorId INTEGER NOT NULL,
  title TEXT NOT NULL,
  createdAt TEXT DEFAULT (DATETIME('now', 'localtime')),
  content TEXT NOT NULL,
  FOREIGN KEY (authorId) REFERENCES Users(id) ON DELETE CASCADE
);

INSERT INTO Articles (authorId, title, content) VALUES
    (1, 'Exploring the Future of AI', 'Artificial intelligence is changing the world, but what does the future hold for it?'),
    (2, 'How to Learn Programming', 'Programming is an essential skill. How can we learn it efficiently?');




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

INSERT INTO Comments (articleId, userId, parentId, content) VALUES
-- Top Comments
    (1, 1, NULL, 'AI development is really fast!'),
    (1, 2, 1, 'Will AI replace human jobs in the future?'),
    (1, 3, 2, 'What’s the best way to get started with coding?'),
    (1, 4, NULL, 'I think AI will open up new opportunities for jobs rather than replace them.'),
    (1, 5, 4, 'Start with small projects and gradually increase the difficulty.'),
    (2, 1, NULL, 'Learning programming can be challenging at first, but it gets easier with practice.'),
    (2, 2, 6, 'What’s the best way to get started with coding?'),
    (2, 3, 7, 'Start with small projects and gradually increase the difficulty.'),
    (2, 4, NULL, 'Yes, the pace of AI is mind-blowing! But I’m excited to see where it goes.'),
    (2, 5, 9, 'I think humans and AI will work together in the future, not one replacing the other.');


