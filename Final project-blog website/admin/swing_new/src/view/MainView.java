package view;

import controller.UserController;
import model.User;
import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.io.File;
import java.net.URL;
import java.util.Arrays;
import java.util.List;
import javax.imageio.ImageIO;

public class MainView {
    private JFrame frame;
    private JTextField usernameField;
    private JPasswordField passwordField;
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
        frame = new JFrame("User Management System");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setSize(1000, 800);
        frame.setLayout(new BorderLayout());
        frame.getContentPane().setBackground(new Color(177, 122, 125)); // 背景

        // 顶部输入面板
        JPanel inputPanel = new JPanel(new GridLayout(2, 2));
        inputPanel.setBackground(new Color(146, 172, 209)); // 输入面板背景颜色
        inputPanel.setPreferredSize(new Dimension(1000, 80));
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

        // 按钮样式
        styleButton(loginButton);
        styleButton(logoutButton);
        styleButton(deleteUserButton);

        JPanel buttonPanel = new JPanel();
        buttonPanel.setBackground(new Color(255, 250, 244)); // 按钮面板背景颜色
        buttonPanel.setPreferredSize(new Dimension(100, 80));
        buttonPanel.add(loginButton);
        buttonPanel.add(logoutButton);
        buttonPanel.add(deleteUserButton);

        // 用户表格
        String[] columnNames = {"ID", "Username", "Role", "RealName", "Date of Birth", "Image Link"};
        tableModel = new DefaultTableModel(columnNames, 0);
        userTable = new JTable(tableModel);
        userTable.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);
        userTable.setBackground(new Color(165, 165, 180)); // 表格背景颜色
        userTable.setFillsViewportHeight(true);

        // 用户信息面板
        userInfoPanel = new JPanel();
        userInfoPanel.setLayout(new BorderLayout());
        userInfoPanel.setBackground(new Color(224, 205, 207)); // 用户信息面板背景颜色
        userInfoPanel.setBorder(BorderFactory.createTitledBorder("User Information")); // 添加边框
        userInfoPanel.setPreferredSize(new Dimension(800, 200)); // 设置用户信息面板的大小

        userInfoLabel = new JLabel("User Info:");
        userInfoLabel.setFont(new Font("Arial", Font.BOLD, 14));
        userInfoPanel.add(userInfoLabel, BorderLayout.NORTH);

        // 创建一个 JPanel 用于显示用户头像
        JPanel imagePanel = new JPanel();
        userImageLabel = new JLabel(); // 用于显示用户图像S
        imagePanel.add(userImageLabel);
        imagePanel.setLayout(new FlowLayout());

        userInfoPanel.add(imagePanel, BorderLayout.CENTER);

        // 将组件添加到框架
        frame.add(inputPanel, BorderLayout.NORTH);
        frame.add(buttonPanel, BorderLayout.CENTER);
        frame.add(new JScrollPane(userTable), BorderLayout.SOUTH);
        frame.add(userInfoPanel, BorderLayout.EAST);

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
                            return userController.getUserDetailsFromAPI(userId);
                        }

                        @Override
                        protected void done() {
                            try {
                                User user = get();
                                if (user != null) {
                                    String personalInfo = user.getDescription();
                                    String realName = user.getRealName();
                                    String birthDate = user.getBirthDate();
                                    userInfoLabel.setText("<html>Username: " + user.getUsername() + "<br>Real Name: "
                                            + realName + "<br>DOB: " + birthDate + "<br>Blurb: " + personalInfo + "</html>");

                                    loadUserImage(user.getImageLink());
                                }
                            } catch (Exception e) {
                                userInfoLabel.setText("获取用户信息失败: " + e.getMessage());
                            }
                        }
                    };
                    worker.execute();
                }
                deleteUserButton.setEnabled(row != -1);
            }
        });

        // 设置窗口可见
        frame.setVisible(true);
    }

    private void styleButton(JButton button) {
        button.setBackground(new Color(255, 250, 244)); // 按钮背景颜色
        button.setForeground(Color.BLACK); // 按钮文字颜色（白色）
        button.setFont(new Font("Arial", Font.BOLD, 12)); // 按钮字体
        button.setPreferredSize(new Dimension(120, 40)); // 设置按钮大小
        button.setBorder(BorderFactory.createEtchedBorder()); // 按钮边框样式
    }

    private void loadUserImage(String imageLink) {
        SwingWorker<ImageIcon, Void> worker = new SwingWorker<>() {
            @Override
            protected ImageIcon doInBackground() {
                try {
                    // 构建 URL 路径
                    String baseURL = "http://localhost:3000/uploads/"; // 基础 URL
                    URL url = new URL(baseURL + imageLink); // 使用 imageLink 作为路径的一部分

                    // 从 URL 读取图片
                    Image image = ImageIO.read(url);
                    return new ImageIcon(image.getScaledInstance(200, 200, Image.SCALE_SMOOTH));
                } catch (Exception e) {
                    e.printStackTrace();
                    return null;
                }
            }

            @Override
            protected void done() {
                try {
                    ImageIcon icon = get();
                    if (icon != null) {
                        userImageLabel.setIcon(icon);
                    } else {
                        userImageLabel.setIcon(null);
                    }
                } catch (Exception e) {
                    userImageLabel.setIcon(null);
                }
            }
        };
        worker.execute();
    }

    private void handleLogin() {
        String username = usernameField.getText();
        String password = new String(passwordField.getPassword());

        if (userController.login(username, password)) {
            JOptionPane.showMessageDialog(frame, "Login Successful");
            loadUserTable();
            logoutButton.setEnabled(true);
            deleteUserButton.setEnabled(false);
            loginButton.setEnabled(false);
            loginButton.setForeground(Color.RED);
            loginButton.setBackground(Color.LIGHT_GRAY);
            loginButton.setBorderPainted(false);
        } else {
            JOptionPane.showMessageDialog(frame, "Login Failed");
        }
    }

    private void handleLogout() {
        usernameField.setText("");
        passwordField.setText("");
        tableModel.setRowCount(0);
        userInfoLabel.setText("用户信息:");
        userImageLabel.setIcon(null);
        logoutButton.setEnabled(false);
        deleteUserButton.setEnabled(false);
        loginButton.setEnabled(true);
        loginButton.setForeground(Color.RED);
        loginButton.setBackground(null);
        loginButton.setBorderPainted(true);
    }

    private void loadUserTable() {
        tableModel.setRowCount(0);
        SwingWorker<List<User>, Void> worker = new SwingWorker<>() {
            @Override
            protected List<User> doInBackground() {
                return userController.getUsersFromAPI();
            }

            @Override
            protected void done() {
                try {
                    List<User> users = get();
                    for (User user : users) {
                        Object[] rowData = new Object[]{
                                user.getId(),
                                user.getUsername(),
                                user.isManager() ? "Manager" : "General user",
                                user.getRealName(),
                                user.getBirthDate(),
                                user.getImageLink()
                        };
                        tableModel.addRow(rowData);
                        System.out.println("Row added: " + Arrays.toString(rowData));
                    }
                } catch (Exception e) {
                    JOptionPane.showMessageDialog(frame, "加载用户失败: " + e.getMessage());
                }
            }
        };
        worker.execute();
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

            String imageLink = (String) tableModel.getValueAt(selectedRow, 5);
            loadUserImage(imageLink);
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
                        boolean success = get();
                        if (success) {
                            JOptionPane.showMessageDialog(frame, "User Deleted Successfully");
                            loadUserTable();
                        } else {
                            JOptionPane.showMessageDialog(frame, "User Deletion Failed");
                        }
                    } catch (Exception e) {
                        JOptionPane.showMessageDialog(frame, "Error: " + e.getMessage());
                    }
                }
            };
            worker.execute();
        } else {
            JOptionPane.showMessageDialog(frame, "Please select a row");
        }
    }
}