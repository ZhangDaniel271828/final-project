package controller;

import model.User;
import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

public class UserController {
    private List<User> users; // 模拟用户数据库

    public UserController() {
        users = new ArrayList<>();
        loadUsers(); // 初始化时加载用户数据
    }

    // 模拟身份验证
    public boolean login(String username, String password) {
        return "admin".equals(username) && "password".equals(password);
    }

    // 加载用户数据（模拟从后端获取）这里要调整。
    public void loadUsers() {
        // 模拟的 JSON 数据
        String jsonData = "[{\"id\":1,\"username\":\"user1\",\"role\":\"admin\"},{\"id\":2,\"username\":\"user2\",\"role\":\"user\"}]";

        // 使用 org.json 解析 JSON 数据
        JSONArray jsonArray = new JSONArray(jsonData);
        users.clear();

        for (int i = 0; i < jsonArray.length(); i++) {
            JSONObject jsonObject = jsonArray.getJSONObject(i);
            int id = jsonObject.getInt("id");
            String username = jsonObject.getString("username");
            String role = jsonObject.getString("role");

            // 将解析后的用户加入列表
            users.add(new User(id, username, role));
        }
    }

    // 获取当前用户列表
    public List<User> getUsers() {
        return users;
    }

    // 删除用户
    public boolean deleteUser(int userId) {
        return users.removeIf(user -> user.getId() == userId);
    }
/*
    public static void main(String[] args) {
        UserController userController = new UserController();

        // 加载用户数据
        List<User> loadedUsers = userController.getUsers();
        System.out.println("加载的用户:");
        for (User user : loadedUsers) {
            System.out.println("ID: " + user.getId() + ", 用户名: " + user.getUsername() + ", 角色: " + user.getRole());
        }

        // 测试删除用户
        int userIdToDelete = 2;
        boolean isDeleted = userController.deleteUser(userIdToDelete);
        System.out.println("删除用户 ID " + userIdToDelete + ": " + (isDeleted ? "成功" : "失败"));

        // 查看删除后的用户列表
        List<User> updatedUsers = userController.getUsers();
        System.out.println("更新后的用户:");
        for (User user : updatedUsers) {
            System.out.println("ID: " + user.getId() + ", 用户名: " + user.getUsername() + ", 角色: " + user.getRole());
        }
    }

 */
}