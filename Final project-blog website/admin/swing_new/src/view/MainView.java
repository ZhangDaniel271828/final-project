package view;

import controller.UserController;
import model.User;
import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.io.File;
import java.util.Arrays;
import java.util.List;
import java.net.URL;
import javax.imageio.ImageIO;

public class MainView {
    private JFrame frame;
    private JTextField usernameField;
    private JPasswordField passwordField; // 使用 JPasswordField
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
        frame = new JFrame("User management system");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setSize(800, 600);
        frame.setLayout(new BorderLayout());

        // 顶部输入面板
        JPanel inputPanel = new JPanel(new GridLayout(2, 2));
        usernameField = new JTextField();
        passwordField = new JPasswordField();
        inputPanel.add(new JLabel("Username:"));
        inputPanel.add(usernameField);
        inputPanel.add(new JLabel("Password:"));
        inputPanel.add(passwordField);

        // 按钮
        loginButton = new JButton("Login");
        logoutButton = new JButton("Logout");
        deleteUserButton = new JButton("Delete User");
        logoutButton.setEnabled(false);
        deleteUserButton.setEnabled(false);

        JPanel buttonPanel = new JPanel();
        buttonPanel.add(loginButton);
        buttonPanel.add(logoutButton);
        buttonPanel.add(deleteUserButton);

        // 用户表格
        String[] columnNames = {"ID", "Username", "Role", "RealName", "DateofBirth"};
        tableModel = new DefaultTableModel(columnNames, 0);
        userTable = new JTable(tableModel);
        userTable.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);

        // 用户信息面板
        userInfoPanel = new JPanel(new BorderLayout());
        userInfoLabel = new JLabel("User Info:");
        userImageLabel = new JLabel(); // 这里可以用于显示用户图片
        userImageLabel.setHorizontalAlignment(SwingConstants.CENTER);

        // 将组件添加到框架
        frame.add(inputPanel, BorderLayout.NORTH);
        frame.add(buttonPanel, BorderLayout.CENTER);
        frame.add(new JScrollPane(userTable), BorderLayout.SOUTH);
        frame.add(userInfoPanel, BorderLayout.EAST);
        userInfoPanel.add(userInfoLabel, BorderLayout.NORTH);
        userInfoPanel.add(userImageLabel, BorderLayout.CENTER);

        // 按钮事件处理
        loginButton.addActionListener(e -> handleLogin());
        logoutButton.addActionListener(e -> handleLogout());
        deleteUserButton.addActionListener(e -> handleDeleteUser());

        // 表格选择事件处理
        userTable.getSelectionModel().addListSelectionListener(e -> updateUserInfo());

        // 添加鼠标点击事件处理
        userTable.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mouseClicked(java.awt.event.MouseEvent evt) {
                int row = userTable.rowAtPoint(evt.getPoint());
                if (row != -1) {
                    int userId = (int) tableModel.getValueAt(row, 0);
                    SwingWorker<User, Void> worker = new SwingWorker<>() {
                        @Override
                        protected User doInBackground() {
                            return userController.getUserDetailsFromAPI(userId); // 获取用户详细信息
                        }

                        @Override
                        protected void done() {
                            try {
                                User user = get(); // 获取用户信息
                                if (user != null) {
                                    String personalInfo = user.getDescription(); // 获取描述
                                    String realName = user.getRealName(); // 获取真实姓名
                                    String birthDate = user.getBirthDate(); // 获取出生日期
                                    userInfoLabel.setText("<html>Username: " + user.getUsername() + "<br>RealName: " +
                                            realName + "<br>DOB: " + birthDate + "<br>Blurb: " + personalInfo + "</html>");

                                    // 加载用户头像
                                    loadUserImage(user.getImageLink());
                                }
                            } catch (Exception e) {
                                userInfoLabel.setText("获取用户信息失败: " + e.getMessage());
                            }
                        }
                    };
                    worker.execute(); // 启动工作线程
                }
                deleteUserButton.setEnabled(row != -1); // 根据是否选择用户启用或禁用删除按钮
            }
        });

        // 设置窗口可见
        frame.setVisible(true);
    }

    private void loadUserImage(String imageLink) {
        SwingWorker<ImageIcon, Void> worker = new SwingWorker<>() {
            @Override
            protected ImageIcon doInBackground() {
                try {
                    // 构建绝对路径
                    String basePath = "/Users/gaoye/new_file_2/final-project/Final project-blog website/admin";
                    File file = new File(basePath + imageLink);

                    // 检查文件是否存在
                    if (!file.exists()) {
                        System.out.println("File does not exist: " + file.getAbsolutePath());
                        return null; // 如果文件不存在，返回 null
                    }

                    // 读取图像
                    Image image = ImageIO.read(file);
                    return new ImageIcon(image.getScaledInstance(50, 50, Image.SCALE_SMOOTH)); // 缩放图像
                } catch (Exception e) {
                    e.printStackTrace();
                    return null; // 发生错误时返回 null
                }
            }

            @Override
            protected void done() {
                try {
                    ImageIcon icon = get();
                    if (icon != null) {
                        userImageLabel.setIcon(icon); // 设置图像
                    } else {
                        userImageLabel.setIcon(null); // 发生错误时清空图像
                    }
                } catch (Exception e) {
                    userImageLabel.setIcon(null); // 发生错误时清空图像
                }
            }
        };
        worker.execute(); // 启动工作线程
    }

    private void handleLogin() {
        String username = usernameField.getText();
        String password = new String(passwordField.getPassword()); // 正确获取密码

        if (userController.login(username, password)) {
            JOptionPane.showMessageDialog(frame, "Login Successful");
            loadUserTable();
            logoutButton.setEnabled(true);
            deleteUserButton.setEnabled(false); // 登录后仍然禁用删除按钮
            loginButton.setEnabled(false); // 禁用登录按钮,来自于老师的要求
            loginButton.setForeground(Color.GRAY); // 变暗登录按钮，来自于老师的要求
            loginButton.setBackground(Color.LIGHT_GRAY); // 变暗登录按钮背景，来自于老师的要求
            loginButton.setBorderPainted(false); // 去掉边框
        } else {
            JOptionPane.showMessageDialog(frame, "Login Failed");
        }
    }

    private void handleLogout() {
        usernameField.setText("");
        passwordField.setText(""); // 清空密码字段
        tableModel.setRowCount(0); // 清空表格
        userInfoLabel.setText("用户信息:");
        userImageLabel.setIcon(null); // 清空用户图像
        logoutButton.setEnabled(false);
        deleteUserButton.setEnabled(false); // 登出后，删除按钮禁用
        loginButton.setEnabled(true); // 启用登录按钮，来自于老师的要求
        loginButton.setForeground(Color.BLACK); // 恢复登录按钮颜色
        loginButton.setBackground(null); // 恢复登录按钮背景
        loginButton.setBorderPainted(true); // 恢复边框
    }

    private void loadUserTable() {
        tableModel.setRowCount(0); // 清空表格
        SwingWorker<List<User>, Void> worker = new SwingWorker<>() {
            @Override
            protected List<User> doInBackground() {
                return userController.getUsersFromAPI();
            }

            @Override
            protected void done() {
                try {
                    List<User> users = get(); // 获取用户列表
                    for (User user : users) {
                        Object[] rowData = new Object[]{
                                user.getId(),
                                user.getUsername(),
                                user.isManager() ? "Manager" : "General user",
                                user.getRealName(),
                                user.getBirthDate(),
                                user.getImageLink() // 确保这里添加了图像链接
                        };
                        tableModel.addRow(rowData);
                        // 打印每行的数据以确认
                        System.out.println("Row added: " + Arrays.toString(rowData));
                    }
                } catch (Exception e) {
                    JOptionPane.showMessageDialog(frame, "加载用户失败: " + e.getMessage());
                }
            }
        };
        worker.execute(); // 启动工作线程
    }

    private void updateUserInfo() {
        int selectedRow = userTable.getSelectedRow();
        if (selectedRow != -1) {
            int userId = (int) tableModel.getValueAt(selectedRow, 0);
            String username = (String) tableModel.getValueAt(selectedRow, 1);
            String role = (String) tableModel.getValueAt(selectedRow, 2);
            String realName = (String) tableModel.getValueAt(selectedRow, 3);
            String birthDate = (String) tableModel.getValueAt(selectedRow, 4);

            userInfoLabel.setText("<html>Username: " + username + "<br>Role: " + role +
                    "<br>RealName: " + realName + "<br>DOB: " + birthDate + "</html>");

            // 显示用户图像
            String imageLink = (String) tableModel.getValueAt(selectedRow, 5); // 假设图像链接在第六列
            loadUserImage(imageLink); // 加载用户图像
        }
    }

    private void handleDeleteUser() {
        int selectedRow = userTable.getSelectedRow();
        if (selectedRow != -1) {
            int userId = (int) tableModel.getValueAt(selectedRow, 0);
            SwingWorker<Boolean, Void> worker = new SwingWorker<>() {
                @Override
                protected Boolean doInBackground() {
                    return userController.deleteUser(userId);
                }

                @Override
                protected void done() {
                    try {
                        boolean success = get(); // 获取结果
                        if (success) {
                            JOptionPane.showMessageDialog(frame, "User Deleted Successfully");
                            loadUserTable(); // 刷新表格
                        } else {
                            JOptionPane.showMessageDialog(frame, "User Deletion Failed");
                        }
                    } catch (Exception e) {
                        JOptionPane.showMessageDialog(frame, "Error: " + e.getMessage());
                    }
                }
            };
            worker.execute(); // 启动工作线程
        } else {
            JOptionPane.showMessageDialog(frame, "Please select a row");
        }
    }
}
