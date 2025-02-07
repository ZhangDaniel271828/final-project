package view;

import controller.UserController;
import model.User;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.awt.event.*;
import java.util.List;

public class MainView {
    private JFrame frame;
    private JTextField usernameField, passwordField;
    private JButton loginButton, logoutButton, deleteUserButton;
    private JTable userTable;
    private DefaultTableModel tableModel;
    private JPanel userInfoPanel;
    private JLabel userInfoLabel, userImageLabel;
    private UserController userController;

    public MainView() {
        userController = new UserController();
        initialize();
    }

    private void initialize() {
        frame = new JFrame("用户管理系统");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setSize(800, 600);
        frame.setLayout(new BorderLayout());

        // 顶部输入面板
        JPanel inputPanel = new JPanel(new GridLayout(2, 2));
        usernameField = new JTextField();
        passwordField = new JPasswordField();
        inputPanel.add(new JLabel("用户名:"));
        inputPanel.add(usernameField);
        inputPanel.add(new JLabel("密码:"));
        inputPanel.add(passwordField);

        // 按钮
        loginButton = new JButton("登录");
        logoutButton = new JButton("注销");
        deleteUserButton = new JButton("删除用户");
        logoutButton.setEnabled(false);
        deleteUserButton.setEnabled(false);

        JPanel buttonPanel = new JPanel();
        buttonPanel.add(loginButton);
        buttonPanel.add(logoutButton);
        buttonPanel.add(deleteUserButton);

        // 用户表格
        String[] columnNames = {"用户ID", "用户名", "角色"};
        tableModel = new DefaultTableModel(columnNames, 0);
        userTable = new JTable(tableModel);

        // 用户信息面板
        userInfoPanel = new JPanel(new BorderLayout());
        userInfoLabel = new JLabel("用户信息将显示在此处");
        userImageLabel = new JLabel();
        userImageLabel.setHorizontalAlignment(SwingConstants.CENTER);

        // 将组件添加到框架
        frame.add(inputPanel, BorderLayout.NORTH);
        frame.add(buttonPanel, BorderLayout.CENTER);
        frame.add(new JScrollPane(userTable), BorderLayout.SOUTH);
        frame.add(userInfoPanel, BorderLayout.EAST);
        userInfoPanel.add(userInfoLabel, BorderLayout.NORTH);
        userInfoPanel.add(userImageLabel, BorderLayout.CENTER);

        // 设置窗口可见
        frame.setVisible(true);
    }
/*
    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> new MainView());
    }

 */
}