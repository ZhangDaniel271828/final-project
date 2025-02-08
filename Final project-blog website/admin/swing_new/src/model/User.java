package model;

public class User {
    private int id;
    private String username;
    private String role;

    public User(int id, String username, String role) {
        this.id = id;
        this.username = username;
        this.role = role;
    }

    // Getter 和 Setter 方法
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", role='" + role + '\'' +
                '}';
    }
/* 测试成功，没问题。
    // 主方法用于测试
    public static void main(String[] args) {
        // 创建用户实例
        User user1 = new User(1, "user1", "admin");
        User user2 = new User(2, "user2", "user");

        // 打印用户信息
        System.out.println(user1);
        System.out.println(user2);

        // 测试 Getter 和 Setter 方法
        user1.setUsername("newUser1");
        user2.setRole("superuser");

        System.out.println("更新后的用户信息:");
        System.out.println(user1);
        System.out.println(user2);
    }

 */
}