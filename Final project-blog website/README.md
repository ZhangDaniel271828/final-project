
Blog System
Overview
This project is a fully functional blog system that includes user management, article publishing, a commenting system, and an admin management panel built with Java Swing. The system is designed to be user-friendly, secure, and efficient.
Features
1. User Management
User registration with unique username validation
Secure password storage using hash + salt
Avatar selection (predefined or custom upload)
Login/logout with session management
Profile management (edit personal details, delete account)
2. Article System
Browse articles without logging in
Search and sort articles by title, author, and date
Article creation, editing, and deletion (WYSIWYG editor)
Support for article images
Like/unlike articles with like count display
3. Comment System
Logged-in users can comment on articles
Nested comments up to 3 levels deep
Users can delete their own comments
Article authors can delete any comments under their posts
Option to hide or display comments
4. Backend API
RESTful API design using JSON format
JWT-based authentication
Admin identification with database flag (isAdmin field)
5. Database Design
users table: Stores user information
articles table: Stores blog posts
comments table: Stores user comments
likes table: Stores user likes on articles
6. Java Swing Admin Panel
Admin login via Swing UI
User management with a table displaying user data
Admin can delete users (which cascades to delete their articles and comments)
UI follows the MVC (Model-View-Controller) design pattern
Asynchronous UI updates to prevent freezing
Tech Stack
Frontend: HTML, CSS, JavaScript, Svelte
Backend: Node.js, Express
Database: SQL
Admin Panel: Java Swing
Authentication: JWT
Version Control: Git
Installation
Prerequisites
Node.js and npm installed
Java Development Kit (JDK) installed
MySQL or other SQL database installed
Git installed
