module.exports.register = (req,res,next) => {
    console.log(`controlador register`)
    res.render('users/register');
  
}
