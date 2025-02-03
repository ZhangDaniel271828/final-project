DROP TABLE IF EXISTS Users;

CREATE TABLE Users (
    id INTEGER NOT NULL PRIMARY KEY,
    username TEXT,
    firstName TEXT,
    lastName TEXT,
    password TEXT,
    blurb TEXT
);

INSERT INTO Users (username, firstName, lastName, password, blurb) VALUES
    ('ketchumall', 'Ash', 'Ketchum', '12345', 'Hey there! I''m Ash Ketchum from the town of Pallet, and my dream is to become a Pokémon Master. Ever since I embarked on my journey with my first and best buddy, Pikachu, I''ve traveled far and wide, across many regions, from Kanto to Galar, competing in Pokémon battles and earning Gym badges with the help of my ever-growing team of awesome Pokémon. Along the way, I''ve met incredible friends, faced off against powerful rivals, and had countless thrilling adventures. My unbreakable spirit and determination have seen me through tough challenges, and I never give up, no matter the odds. With every experience, I learn more about Pokémon and how to be a better trainer. To me, it''s not just about winning; it''s about the strong bonds I forge with my Pokémon as we grow and evolve together. So, whether it''s on the battlefield or exploring new horizons, I''m always ready to seize the day and aim for the top with my catchphrase, "Gotta catch ''em all!"'),
    ('pokemondoctor', 'Joy', 'Nurtureheart', '67890', 'Hello there! I''m Nurse Joy, and I am wholeheartedly devoted to the nurturing and healing of Pokémon. As a cherished figure in the Pokémon community, I take great pride in offering warmth and medical expertise at the Pokémon Center, a refuge for trainers and their beloved Pokémon. My daily joy comes from ensuring that all Pokémon are in peak health, ready to explore the world by their trainers'' sides. With a gentle touch and an encyclopedic knowledge of Pokémon health care, I, along with my trusted Chansey, provide a restorative sanctuary where every Pokémon can recuperate and regain their strength. Whether it''s treating a Pikachu''s cold or aiding a Charizard''s recovery after a heated battle, my commitment to their care is as steadfast as the bond between Pokémon and trainer. If your Pokémon companion is ever feeling under the weather, just look for the comforting glow of the Pokémon Center - Nurse Joy will always be there to welcome you with open arms and a healing smile!'),
    ('growlitheisbae', 'Jenny', 'Ironwill', 'pa55word', 'Hello, citizens! I''m Officer Jenny, upholding the law and maintaining peace throughout the Pokémon world. As a dedicated member of the police force, renowned for our distinctive blue uniforms and partnership with trusty Growlithe or Herdier companions, I work tirelessly to protect people and Pokémon alike. My family has a long-standing tradition of service, and you''ll find my cousins in nearly every town, each of us committed to justice and safety. Whether I''m cracking down on Team Rocket''s schemes or directing traffic for a bustling festival, my mission is to ensure harmony and order. With a keen sense of duty and a compassionate heart, I''m here to serve and defend, remaining ever vigilant against any trouble that might arise. Remember, whether you''re in a bustling city or a sleepy little town, an Officer Jenny is never far to keep you and your Pokémon safe!'),
    ('1514eva', 'Samuel', 'Oak', 'pokemon', 'Good day, trainers and Pokémon enthusiasts alike! I am Professor Samuel Oak, often regarded as one of the leading Pokémon researchers in the world. Nestled in the quaint town of Pallet, my laboratory is a hub for knowledge, where I study Pokémon behavior, habitats, and the mysterious bonds they share with humans. Renowned for my work in the field of Pokémon evolution and Pokédex development, I dedicate my life to educating young trainers, like my grandson Gary and the spirited Ash Ketchum, providing them with their first Pokémon and a Pokédex to embark on their thrilling journeys. It is my firm belief that through research, exploration, and the fostering of relationships between people and Pokémon, we can unlock even greater mysteries of the world we share. I am always eager to learn and discover, and it is my pleasure to guide the next generation of Pokémon Masters on their path to greatness. Remember, my dear friends, "The more you know about Pokémon, the more fascinating they become!"');