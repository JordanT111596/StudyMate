module.exports = function (sequelize, DataTypes) {
    const Subject = sequelize.define("subject",
        {
            subject: {
                type: DataTypes.STRING,
                allowNull: false
            }
        },
        {
            timestamps: false
        }
    );

    Subject.associate = models => {
        Subject.belongsToMany(models.user, {
            through: "user_subject"
        });
    };
    return Subject;
};