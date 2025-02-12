package model;

public class User {
    private int id;
    private String username;
    private boolean isManager;
    private String realName;    // 真实姓名
    private String birthDate;   // 出生日期
    private String description;  // 介绍
    private String imageLink;    // 图片链接

    // 修改构造函数，以包含新的字段
    public User(int id, String username, boolean isManager, String realName, String birthDate, String description, String imageLink) {
        this.id = id;
        this.username = username;
        this.isManager = isManager;
        this.realName = realName;
        this.birthDate = birthDate;
        this.description = description;
        this.imageLink = imageLink; // 初始化图片链接
    }

    // Getter 方法
    public int getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public boolean isManager() {
        return isManager;
    }

    public String getRealName() {
        return realName;
    }

    public String getBirthDate() {
        return birthDate;
    }

    public String getDescription() {
        return description;
    }

    public String getImageLink() {
        return imageLink; // 获取图片链接
    }
}