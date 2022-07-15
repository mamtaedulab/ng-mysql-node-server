const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  var mydata =sequelize.define('mydata', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    aboutMe: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    institution: {
      type:DataTypes.STRING(255),
      allowNull: false
    },
    university: {
        type:DataTypes.STRING(255),
        allowNull: false
      },
      year: {
        type:DataTypes.STRING(255),
        allowNull: false
      },
      program: {
        type:DataTypes.STRING(255),
        allowNull: false
      },
      stream: {
        type:DataTypes.STRING(255),
        allowNull: false
      },
      location: {
        type:DataTypes.STRING(255),
        allowNull: false
      },
      image:{
        type:DataTypes.STRING(255),
   
      },
      video:{
        type:DataTypes.STRING(255),
    
      }
  }, {
    sequelize,
    tableName: 'mydata',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  return mydata;
};

