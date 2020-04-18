const dashboardLoader = (req,res)=>{

    if (req.session.userInfo.type=="Admin"){

        res.redirect("admin")
        
    } 

    else {
        res.render("profile")
    }

}


module.exports = dashboardLoader;