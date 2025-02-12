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
('SuperGaoye22', 'password123', 'Gaoye Super', '1990-05-14', 'A software enthusiast with a passion for coding.', 1, 'Super.jpg'),
('NanaDreamer', 'password456', 'Nana Kudo', '1993-07-22', 'Lover of books and art.', 0, 'pokomen.png'),
('CoderZ', 'password789', 'Zhang Wei', '1988-11-30', 'Tech geek and AI explorer.', 0, 'pokomen1.png'),
('CreativeMax', 'password000', 'Max Li', '1995-01-15', 'A writer and gamer at heart.', 0, 'pokomen2.png'),
('AlexGamer21', 'gamer123', 'Alex Chen', '1992-03-10', 'Avid gamer with a passion for strategy games.', 0, 'pokomen3.png'),
('TechieTina', 'tina456', 'Tina Zhang', '1994-06-17', 'Technology lover and aspiring software engineer.', 0, 'pokomen4.png'),
('BookwormLeo', 'leo789', 'Leo Wang', '1991-08-22', 'Book lover, especially fantasy and sci-fi novels.', 0, 'pokomen5.png'),
('MusicFanJane', 'jane321', 'Jane Liu', '1990-12-05', 'Music enthusiast, with a special love for classical piano.', 0, 'pokomen.png'),
('ArtisticXia', 'xia654', 'Xia Wu', '1996-11-18', 'Art is my life, from painting to sculpture.', 0, 'pokomen.png'),
('EcoWarriorElla', 'ella987', 'Ella Li', '1993-09-30', 'Environmental advocate, passionate about sustainability.', 0, 'pokomen.png');

INSERT INTO Articles (authorId, username, article_title, content) VALUES
(1, 'SuperGaoye22', 'The Future of Artificial Intelligence', 'Artificial intelligence is changing the world at an unprecedented pace. We are witnessing breakthroughs in many fields, from healthcare to finance. In this article, we will explore the possibilities AI holds for the future.'),
(1, 'SuperGaoye22', 'The Beauty of Minimalism', 'Minimalism is more than just an aesthetic. It’s a lifestyle that emphasizes simplicity and contentment. This article discusses the benefits of adopting a minimalist approach to life and design.'),
(1, 'SuperGaoye22', 'Exploring Quantum Computing', 'Quantum computing promises to revolutionize computing power. But what exactly is it? Let’s dive into the basics of quantum mechanics and explore its potential in solving problems that are beyond the capabilities of classical computers.'),
(1, 'SuperGaoye22', 'The Power of Video Games', 'Video games have evolved into a form of art that can influence creativity and problem-solving. In this article, we will explore how video games can enhance cognitive skills and imagination.'),
(1, 'SuperGaoye22', 'The Cognitive Benefits of Strategy Games', 'Strategy games offer more than just entertainment—they enhance our cognitive abilities, improve decision-making, and promote critical thinking. Let’s explore why strategy games are so beneficial.'),
(1, 'SuperGaoye22', 'Machine Learning and Its Applications', 'Machine learning is revolutionizing industries across the globe. From predicting trends to automating processes, this technology has a vast range of applications. This article looks at the most significant uses of machine learning today.'),
(1, 'SuperGaoye22', 'Fantasy Literature: A Gateway to Imagination', 'Fantasy literature allows readers to escape into magical worlds filled with adventure and wonder. This article explores the power of fantasy literature in sparking creativity and imagination.'),
(1, 'SuperGaoye22', 'The Timelessness of Classical Music', 'Classical music has stood the test of time. In this article, we examine why classical compositions remain relevant and continue to inspire generations of musicians and listeners.'),
(1, 'SuperGaoye22', 'Modern Art: A Reflection of Society', 'Modern art has been a subject of much debate. In this article, we discuss how modern art reflects the complexities and challenges of contemporary society.'),
(1, 'SuperGaoye22', 'Sustainability in Everyday Life', 'Living sustainably is no longer just a trend—it’s a necessity. This article explores small changes we can make in our daily lives to reduce our carbon footprint and live more sustainably.');


-- 点赞数据
INSERT INTO Likes (user_id, article_id) VALUES
(2, 1), (3, 1), (4, 1), (5, 1), (6, 1), (7, 1), (8, 1), (9, 1), (10, 1), (1, 2),
(2, 2), (3, 2), (4, 2), (5, 2), (6, 2), (7, 2), (8, 2), (9, 2), (10, 2), (1, 3),
(2, 3), (3, 3), (4, 3), (5, 3), (6, 3), (7, 3), (8, 3), (9, 3), (10, 3), (1, 4),
(2, 4), (3, 4), (4, 4), (5, 4), (6, 4), (7, 4), (8, 4), (9, 4), (10, 4), (1, 5),
(2, 5), (3, 5), (4, 5), (5, 5), (6, 5), (7, 5), (8, 5), (9, 5), (10, 5), (1, 6),
(2, 6), (3, 6), (4, 6), (5, 6), (6, 6), (7, 6), (8, 6), (9, 6), (10, 6), (1, 7),
(2, 7), (3, 7), (4, 7), (5, 7), (6, 7), (7, 7), (8, 7), (9, 7), (10, 7), (1, 8),
(2, 8), (3, 8), (4, 8), (5, 8), (6, 8), (7, 8), (8, 8), (9, 8), (10, 8), (1, 9),
(2, 9), (3, 9), (4, 9), (5, 9), (6, 9), (7, 9), (8, 9), (9, 9), (10, 9), (1, 10),
(2, 10), (3, 10), (4, 10), (5, 10), (6, 10), (7, 10), (8, 10), (9, 10), (10, 10);

-- 评论数据
-- 文章1
INSERT INTO Comments (articleId, userId, content) VALUES
(1, 2, 'This article is very insightful! The future of AI seems promising.'),
(1, 3, 'I agree! AI is changing many industries, especially healthcare.'),
(1, 4, 'It’s fascinating to think about the breakthroughs we’ll see in the next few years.'),
(1, 5, 'AI is definitely the future! Can’t wait to see more applications in everyday life.'),
(1, 6, 'Nice article! AI is going to revolutionize the way we live and work.'),
(1, 7, 'I am really excited about how AI can improve education systems.'),
(1, 8, 'I wonder how AI will impact the job market in the future.'),
(1, 9, 'There’s so much potential in AI, but we also need to consider ethical implications.'),
(1, 10, 'Great read! Looking forward to seeing AI’s impact on the environment.');

-- 文章2
INSERT INTO Comments (articleId, userId, content) VALUES
(2, 2, 'I love minimalist design! It’s so calming and organized.'),
(2, 3, 'Minimalism really helps reduce clutter in both life and home.'),
(2, 4, 'I’ve recently adopted a minimalist approach to my life. It’s made me so much more productive.'),
(2, 5, 'Great article! I believe minimalism is a lifestyle change that can truly enhance our well-being.'),
(2, 6, 'I agree! Simplifying our spaces and lives can bring peace of mind.'),
(2, 7, 'Minimalism is such a liberating approach to life. I’m planning to try it out soon!'),
(2, 8, 'I love how minimalism can make things feel more intentional and meaningful.'),
(2, 9, 'Minimalism is a great way to declutter both your home and your mind.');

-- 文章3
INSERT INTO Comments (articleId, userId, content) VALUES
(3, 2, 'Quantum computing is mind-blowing! It could solve problems we never thought possible.'),
(3, 3, 'I can’t wait for quantum computers to become more mainstream!'),
(3, 4, 'Quantum computing is a huge leap forward. It will change so much in science and technology.'),
(3, 5, 'Amazing potential in quantum computing! It could change how we process information.'),
(3, 6, 'I hope to see practical applications of quantum computing in my lifetime.'),
(3, 7, 'Quantum computing will definitely be the next big thing after AI.'),
(3, 8, 'I’m still wrapping my head around quantum computing, but the potential is incredible.');
-- Continue for other articles similarly