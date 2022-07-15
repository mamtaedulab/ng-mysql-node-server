const { STRING } = require('sequelize');
const Sequelize =require('sequelize');
module.exports=function(sequelize,DataTypes){
    var blog = sequelize.define('blogs',{
        id:{
            autoIncrement:true,
            type:DataTypes.BIGINT.UNSIGNED,
            allowNull:false,
            primaryKey:true
        },
        title:{
            type:DataTypes.STRING(255),
            allowNull:false
        },
        date_of_publishing:{
            type:DataTypes.STRING(255),
            allowNull:false
        },
        author_name:{
            type:DataTypes.STRING(255),
            allowNull:false
        },
        reading_time:{
            type:DataTypes.STRING(255),
            allowNull:false
        },
        summary:{
            type:DataTypes.STRING(255),
            allowNull:false
        },
        image:{
            type:DataTypes.STRING(255),
            defaultValue:'xyz'
        }
    
    },{
        sequelize,
        tableName:'blogs',
        timestamps:true,
        indexes:[
            {
                name:"PRIMARY",
                unique:true,
                using:"BTREE",
                fields:[
                    {name:"id"}
                ]
            }
        ]
    });
    return blog;
}