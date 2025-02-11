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

INSERT INTO Users (username, password, realName, birthDate, blurb, isManager,imageLink) VALUES
    ('SuperGaoye', 'gaoye12345', 'gaoye', '2025-05-22', 'Hey there! I am gaoye, and I am a foodie! Also, I am a manager of this website', 1,'/default_img/Super.jpg'),
    ('ketchumall', '12345', 'Ash Ketchum', '1990-05-22', 'Hey there! I am Ash Ketchum from Pallet Town, dreaming of becoming a Pokémon Master.', 0,'/default_img/pokomen.png'),
    ('pokemondoctor', '67890', 'Joy Nurtureheart', '1985-03-15', 'I am Nurse Joy, devoted to nurturing and healing Pokémon at the Pokémon Center.', 0,'/default_img/pokomen2.png'),
    ('growlitheisbae', 'pa55word', 'Jenny Ironwill', '1992-07-11', 'I am Officer Jenny, upholding peace and protecting Pokémon with my Growlithe.', 0,'/default_img/pokomen3.png'),
    ('1514eva', 'pokeman', 'Samuel Oak', '1950-09-14', 'I am Professor Oak, passionate about Pokémon research and helping young trainers.', 0,'/default_img/pokomen4.png'),
    ('mistyfan', 'watergym', 'Misty Waterflower', '1994-06-01', 'I am Misty, the Cerulean City Gym Leader, specializing in Water-type Pokémon.', 0,'/default_img/pokomen5.png');


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


INSERT INTO Articles (authorId, username, article_title, content) VALUES
    (3, 'pokemondoctor', 'The Rise of Quantum Computing', 'Quantum computers could revolutionize industries, but how far are we from practical applications?'),
    (4, 'growlitheisbae', 'Why Cybersecurity Matters', 'As technology advances, so do cyber threats. How can we protect our digital assets?'),
    (5, '1514eva', 'The Future of Space Exploration', 'Humanity is looking beyond Earth. Will we become an interplanetary species?'),
    (1, 'SuperGaoye', 'Mastering Data Science', 'Data science is one of the most in-demand skills today. Here’s how to get started.'),
    (2, 'ketchumall', 'The Psychology of Learning', 'Understanding how our brains learn can help us become more efficient learners.'),
    (3, 'pokemondoctor', 'The Impact of Social Media', 'Social media connects us, but is it also making us more disconnected?'),
    (4, 'growlitheisbae', 'Balancing Work and Life', 'Finding a balance between work and personal life is crucial for well-being.'),
    (5, '1514eva', 'The Ethics of AI', 'As AI becomes more advanced, ethical concerns grow. Where should we draw the line?'),
    (1, 'SuperGaoye', 'The History of Programming Languages', 'From Assembly to Python, let’s explore the evolution of programming languages.'),
    (2, 'ketchumall', 'How to Build a Startup', 'Starting a business is challenging. Here are some lessons from successful entrepreneurs.'),
    (3, 'pokemondoctor', 'The Science of Sleep', 'Sleep is essential for health. How can we optimize our sleep patterns?'),
    (4, 'growlitheisbae', 'The Role of Music in Human Emotion', 'Music has a profound impact on our emotions. But why does it affect us so deeply?'),
    (5, '1514eva', 'Will Robots Take Our Jobs?', 'Automation is increasing. Will it lead to mass unemployment or new opportunities?');








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


