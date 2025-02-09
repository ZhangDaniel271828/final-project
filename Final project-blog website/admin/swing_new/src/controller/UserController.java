package controller;

import model.User;
import java.util.Collections;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import org.json.JSONArray;
import org.json.JSONObject;

public class UserController {
    private List<User> users; // 存储用户列表
    private Connection connection;
    private static final String API_URL = "http://localhost:3000/api/users/all";

    public UserController() {
        users = new ArrayList<>();
        connectDatabase(); // 连接数据库
    }

    // 连接到 SQLite 数据库
    private void connectDatabase() {
        try {
            String url = "jdbc:sqlite:backend/user_database.db";
            connection = DriverManager.getConnection(url);
            System.out.println("成功连接到数据库");
        } catch (SQLException e) {
            System.out.println("数据库连接错误: " + e.getMessage());
            e.printStackTrace();
        }
    }

    // 模拟身份验证对于管理员
    public boolean login(String username, String password) {
        String sql = "SELECT * FROM Users WHERE username = ? AND password = ? AND isManager = 1";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setString(1, username);
            pstmt.setString(2, password);
            ResultSet rs = pstmt.executeQuery();
            return rs.next(); // 如果找到用户，返回 true
        } catch (SQLException e) {
            System.out.println("登录错误: " + e.getMessage());
            return false;
        }
    }

    public List<User> loginAndGetUsers(String username, String password) {
        if (login(username, password)) {
            users = getUsersFromAPI(); // 登录成功，获取用户信息
            return users;
        } else {
            System.out.println("管理员验证失败");
            return Collections.emptyList(); // 返回空列表
        }
    }

    public List<User> getUsersFromAPI() {
        List<User> usersFromAPI = new ArrayList<>();
        HttpURLConnection conn = null;

        try {
            URL url = new URL(API_URL);
            conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");

            if (conn.getResponseCode() == HttpURLConnection.HTTP_OK) {
                BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
                String inputLine;
                StringBuilder response = new StringBuilder();

                while ((inputLine = in.readLine()) != null) {
                    response.append(inputLine);
                }
                in.close();

                // 解析 JSON 数据
                JSONArray jsonArray = new JSONArray(response.toString());
                for (int i = 0; i < jsonArray.length(); i++) {
                    JSONObject jsonObject = jsonArray.getJSONObject(i);
                    int id = jsonObject.getInt("id");
                    String username = jsonObject.getString("username");
                    boolean isManager = jsonObject.getInt("isManager") == 1;
                    String realName = jsonObject.getString("realName");
                    String birthDate = jsonObject.getString("birthDate");
                    String description = jsonObject.getString("blurb");

                    usersFromAPI.add(new User(id, username, isManager, realName, birthDate, description));
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (conn != null) {
                conn.disconnect(); // 确保连接被关闭
            }
        }
        return usersFromAPI;
    }

    // 获取当前用户列表
    public List<User> getUsers() {
        return users;
    }

    public User getUserDetailsFromAPI(int userId) {
        User user = null;
        HttpURLConnection conn = null;

        try {
            // 构造 API URL
            String apiUrl = "http://localhost:3000/api/users/" + userId; // 假设这是获取用户详细信息的 API
            URL url = new URL(apiUrl);
            conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");

            if (conn.getResponseCode() == HttpURLConnection.HTTP_OK) {
                BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
                String inputLine;
                StringBuilder response = new StringBuilder();

                while ((inputLine = in.readLine()) != null) {
                    response.append(inputLine);
                }
                in.close();

                // 解析 JSON 数据
                JSONObject jsonObject = new JSONObject(response.toString());
                int id = jsonObject.getInt("id");
                String username = jsonObject.getString("username");
                boolean isManager = jsonObject.getInt("isManager") == 1;
                String realName = jsonObject.getString("realName");
                String birthDate = jsonObject.getString("birthDate");
                String description = jsonObject.getString("blurb");

                user = new User(id, username, isManager, realName, birthDate, description);
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (conn != null) {
                conn.disconnect(); // 确保连接被关闭
            }
        }
        return user;
    }
    public boolean deleteUser(int userId) {
        String apiUrl = "http://localhost:3000/api/auth/delete/" + userId;
        try {
            // 创建 URL 对象
            URL url = new URL(apiUrl);
            // 打开连接
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            // 设置请求方法为 DELETE
            connection.setRequestMethod("DELETE");

            // 获取响应代码
            int responseCode = connection.getResponseCode();
            if (responseCode == HttpURLConnection.HTTP_NO_CONTENT) {
                return true; // 删除成功
            } else {
                System.out.println("删除用户失败，响应代码: " + responseCode);
                return false; // 删除失败
            }
        } catch (Exception e) {
            System.out.println("调用 API 删除用户时出错: " + e.getMessage());
            return false; // 调用 API 出错
        }
    }

    // 关闭数据库连接
    public void close() {
        try {
            if (connection != null) {
                connection.close();
                System.out.println("数据库连接已关闭");
            }
        } catch (SQLException e) {
            System.out.println("关闭连接时出错: " + e.getMessage());
        }
    }
}