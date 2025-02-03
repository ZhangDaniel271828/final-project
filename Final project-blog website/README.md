# CS719 Lab - The Full Stack

In this lab, we will continue from the "Authentication" lab, and transform that application to use a database. We highly recommend you work in the same teams you worked in to complete that lab!

You're given essentially a model soluton for that lab as a starting point, with a couple of extra files:

- `src/db/database.js`: The same `database.js` file included in the examples code. Contains useful functions for obtaining access to the SQLite database from the rest of your code.

- `src/sql/init-db.sql`: An empty SQL file which will be used to create and initialize your database.

## Exercise One: Creating the database

Firstly, design a database schema based on the dummy data contained within `users-dao.js`. You should only need one table in your database, with six columns. Add the SQL `CREATE` statement to `init-db.sql`, along with an `INSERT` statement to add dummy data to the database.

**Hint:** Here's a dummy data `INSERT` statement which adds the same data that's currently in the dummy data array:

```sql
INSERT INTO Users (username, firstName, lastName, password, blurb) VALUES
    ('ketchumall', 'Ash', 'Ketchum', '12345', 'Hey there! I''m Ash Ketchum from the town of Pallet, and my dream is to become a Pokémon Master. Ever since I embarked on my journey with my first and best buddy, Pikachu, I''ve traveled far and wide, across many regions, from Kanto to Galar, competing in Pokémon battles and earning Gym badges with the help of my ever-growing team of awesome Pokémon. Along the way, I''ve met incredible friends, faced off against powerful rivals, and had countless thrilling adventures. My unbreakable spirit and determination have seen me through tough challenges, and I never give up, no matter the odds. With every experience, I learn more about Pokémon and how to be a better trainer. To me, it''s not just about winning; it''s about the strong bonds I forge with my Pokémon as we grow and evolve together. So, whether it''s on the battlefield or exploring new horizons, I''m always ready to seize the day and aim for the top with my catchphrase, "Gotta catch ''em all!"'),
    ('pokemondoctor', 'Joy', 'Nurtureheart', '67890', 'Hello there! I''m Nurse Joy, and I am wholeheartedly devoted to the nurturing and healing of Pokémon. As a cherished figure in the Pokémon community, I take great pride in offering warmth and medical expertise at the Pokémon Center, a refuge for trainers and their beloved Pokémon. My daily joy comes from ensuring that all Pokémon are in peak health, ready to explore the world by their trainers'' sides. With a gentle touch and an encyclopedic knowledge of Pokémon health care, I, along with my trusted Chansey, provide a restorative sanctuary where every Pokémon can recuperate and regain their strength. Whether it''s treating a Pikachu''s cold or aiding a Charizard''s recovery after a heated battle, my commitment to their care is as steadfast as the bond between Pokémon and trainer. If your Pokémon companion is ever feeling under the weather, just look for the comforting glow of the Pokémon Center - Nurse Joy will always be there to welcome you with open arms and a healing smile!'),
    ('growlitheisbae', 'Jenny', 'Ironwill', 'pa55word', 'Hello, citizens! I''m Officer Jenny, upholding the law and maintaining peace throughout the Pokémon world. As a dedicated member of the police force, renowned for our distinctive blue uniforms and partnership with trusty Growlithe or Herdier companions, I work tirelessly to protect people and Pokémon alike. My family has a long-standing tradition of service, and you''ll find my cousins in nearly every town, each of us committed to justice and safety. Whether I''m cracking down on Team Rocket''s schemes or directing traffic for a bustling festival, my mission is to ensure harmony and order. With a keen sense of duty and a compassionate heart, I''m here to serve and defend, remaining ever vigilant against any trouble that might arise. Remember, whether you''re in a bustling city or a sleepy little town, an Officer Jenny is never far to keep you and your Pokémon safe!'),
    ('1514eva', 'Samuel', 'Oak', 'pokemon', 'Good day, trainers and Pokémon enthusiasts alike! I am Professor Samuel Oak, often regarded as one of the leading Pokémon researchers in the world. Nestled in the quaint town of Pallet, my laboratory is a hub for knowledge, where I study Pokémon behavior, habitats, and the mysterious bonds they share with humans. Renowned for my work in the field of Pokémon evolution and Pokédex development, I dedicate my life to educating young trainers, like my grandson Gary and the spirited Ash Ketchum, providing them with their first Pokémon and a Pokédex to embark on their thrilling journeys. It is my firm belief that through research, exploration, and the fostering of relationships between people and Pokémon, we can unlock even greater mysteries of the world we share. I am always eager to learn and discover, and it is my pleasure to guide the next generation of Pokémon Masters on their path to greatness. Remember, my dear friends, "The more you know about Pokémon, the more fascinating they become!"');
```

## Exercise Two: Use the database

Next, in `users-dao.js`, delete the `users` array, import `getDatabase()` from `database.js`, and use the appropriate `sqlite` functions to enable database access.

**Hints:**

- You'll need to change the three functions here into `async` functions, as all `sqlite` functions are `async` and we will need to `await` them.

- You'll need a `SELECT` statement in `getUserWithUsername()`, and another one in `getUserWithCredentials()`. Both return a maximum of one row.

- You'll need an `UPDATE` statement in `updateUser()`, and need to consider the fact that `firstName`, `lastName`, `password`, and `blurb` are all _optional_ values. Look at the example code to see how this can be handled.

## Exercise Three: Minor modifications

You won't need to change too much code outside of `users-dao.js`. However, you will need to:

- In `app.js` at the marked location near the end of the file, import and add a call to `await getDatabase()` to ensure the database is loaded and running as soon as the application starts.

- In `auth-middleware.js`, `api-auth.js` and `api-users.js`, you will need to make every function which calls one of your `users-dao.js` functions into an `async` function, and will need to `await` calls to those dao functions.

After Exercises One - Three, you should be able to test, and your app should behave the same as it did before, but is now backed by a database rather than an array! If you shutdown your backend and restart it, since the data is now stored in the database, any changes will be persisted.

## The Final Exercise™️: Practice!

Now that you've got a solid example full-stack system with authentication setup, see if you can add some simple functionality. Here's one example (though feel free to implement whatever you want, as practice):

Modify the app so that each user in your system has a todo list. Each todo list has a number of items which have a text description and a boolean value indicating whether or not the item is complete.

To implement this functionality, you will need to:

1. Change your database schema to include a Todos table, which will have some kind of FK relationship on the existing Users table.

2. Add a `todos-dao.js` file with functions to interact with the database to create and modify todo items.

3. Add API routes allowing an authenticated user to create and modify their own todo items.

4. Add a new page to your frontend which loads and displays the currently authenticated user's todo items.

5. Add the ability to toggle todo items' completed status on the frontend. When the status of a todo changes on your frontend, this should result in an API call to your backend to perform the update, which in turn should result in an SQL statement being run on the database.

6. Style the frontend (both your new page and what's already there) to make it look more beautiful 😍.

If you can achieve these six steps, then you can pat yourself on the back, as you have truly understood and have a fantastic grasp of the tech stack taught in COMPSCI 719!
