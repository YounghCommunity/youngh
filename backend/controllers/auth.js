// Models 
const User = require('../models/user');

module.exports = {
    POST_Register : (req, res, next) => {
        const userType = req.query.userType;
        let responseSent = false;

        switch (userType) 
        {
            case "mentor": 
            case "mentee" : 
                break; 
            default : 
                if(!responseSent) 
                {
                    res.json({
                        error : "Invalid user type"
                    });
                    responseSent = true;
                }
                break;
        }

        const username = req.body.username; 
        const email = req.body.email;
        const password =  req.body.password;
        const description = req.body.description;
        const skills = req.body.skills;
        const jobTitle = req.body.jobTitle;
        const jobCategory = req.body.jobCategory;

        if(!username && !responseSent)
        {
            res.json({
                error : "Username is required"
            }); 
            responseSent = true;
        }
        if(!email && !responseSent) 
        {
            res.json({
                error : "Email is required"
            });
            responseSent = true;
        }
        if(!password && !responseSent)
        {
            res.json({
                error : "Password is required"
            });
            responseSent = true;
        }
        if(userType == "mentor" && !description && !responseSent)
        {
            res.json({
                error : "Description is required for mentors"
            });
            responseSent = true;
        }
        if(userType == "mentor" && !jobTitle && !responseSent)
        {
            res.json({
                error : "Job title is required for mentors"
            });
            responseSent = true;
        }
        if(userType == "mentor" && !jobCategory && !responseSent)
        {
            res.json({
                error : "Job category is required for mentors"
            });
            responseSent = true;
        }
        
        User.findOne({username : username}).then((user) => {
            if(!responseSent) 
            {
                if(user)
                {
                    res.json({
                        message : "Username already exists"
                    });
                    responseSent = true;
                }
                else 
                {
                    return User.findOne({email : email});
                }
            }
        }).then((user) => {
            if(!responseSent)
            {
                if(user)
                {
                    res.json({
                        message : "Email already exists"
                    });
                    responseSent = true;
                }
                else 
                {
                    const newUser = new User({
                        email : email, 
                        password :  password, 
                        username : username, 
                        userType : userType, 
                        description : description, 
                        skills : skills, 
                        jobTitle : jobTitle, 
                        jobCategory : jobCategory
                    }); 
                    return newUser.save();
                }
            }
        }).then((user) => {
            if(!responseSent)
            {
                if(user.userType == 'mentor')
                {
                    return user.addStars();
                }
                else 
                {
                    return user; 
                }   
            }
        }).then((user) => {
            if(!responseSent) 
            {
                res.json({
                    message : "User created successfully", 
                    user : user
                });
                responseSent = true;
            }
        });
        
    }, 

    POST_Login : (req, res, next) => {
        const username = req.body.username; 
        const password =  req.body.password;

        let responseSent = false;

        if(!username && !responseSent)
        {
            res.json({
                error : "Username is required"
            }); 
            responseSent = true;
        }
        if(!password && !responseSent)
        {
            res.json({
                error : "Password is required"
            });
            responseSent = true;
        }

        User.findOne({username : username}).then((user) => {
            if(!responseSent)
            {
                if(!user)
                {
                    res.json({
                        error : "User not found"
                    });
                    responseSent = true;
                }
                else 
                {
                    if(user.password == password) 
                    {
                        res.json({
                            message : "User logged in successfully", 
                            user : user
                        });
                        responseSent = true;
                    }
                    else 
                    {
                        res.json({
                            error : "Incorrect password"
                        });
                        responseSent = true;
                    }
                }
            }
        });
    }
}; 