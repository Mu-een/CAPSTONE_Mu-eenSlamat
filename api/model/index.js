const db = require('../config');
const {hash, compare, hashSync} = require('bcrypt');
const {createToken} = require('../middleware/AuthenticatedUser');

class User {
    login(req, res) {
        const {emailAddress, userPassword} = req.body;
        const strQry = 
        `
        SELECT firstName, lastName, gender, emailAddress, userPassword, userProfile
        FROM users
        WHERE emailAddress = '${emailAddress}';
        `;
        db.query(strQry, async (err, data)=>{
            if(err) throw err;
            if((!data.length) || (data == null)) {
                res.status(401).json({err: 
                    "You provided a wrong email address"});
            }else {
                await compare(userPassword, 
                    data[0].userPassword, 
                    (cErr, cResult)=> {
                        if(cErr) throw cErr;
                        // Create a token
                        const jwToken = 
                        createToken(
                            {
                                emailAddress, userPassword 
                            }
                        );
                        // Saving
                        res.cookie('LegitUser',
                        jwToken, {
                            maxAge: 3600000,
                            httpOnly: true
                        })
                        if(cResult) {
                            res.status(200).json({
                                msg: 'Logged in',
                                jwToken,
                                result: data[0]
                            })
                        }else {
                            res.status(401).json({
                                err: 'You entered an invalid password or did not register. '
                            })
                        }
                    })
            }
        })     
    }
    fetchUsers(req, res) {
        const strQry = 
        `
        SELECT userId, firstName, lastName, gender, emailAddress, userProfile, userPassword
        FROM users;
        `;
        //db
        db.query(strQry, (err, data)=>{
            if(err) throw err;
            else res.status(200).json( 
                {results: data} );
        })
    }
    fetchUser(req, res) {
        const strQry = 
        `
        SELECT userId, firstName, lastName, gender, emailAddress, userProfile, userPassword
        FROM users
        WHERE userId = ?;
        `;
        //db
        db.query(strQry,[req.params.id], 
            (err, data)=>{
            if(err) throw err;
            else res.status(200).json( 
                {results: data} );
        })

    }
    async createUser(req, res) {
        // Payload
        let detail = req.body;
        // Hashing user password
        detail.userPassword = await 
        hash(detail.userPassword, 15);
        // This information will be used for authentication.
        let user = {
            emailAddress: detail.emailAddress,
            userPassword: detail.userPassword
        }
        // sql query
        const strQry =
        `INSERT INTO users
        SET ?;`;
        db.query(strQry, [detail], (err)=> {
            if(err) {
                res.status(401).json({err});
            }else {
                // Create a token
                const jwToken = createToken(user);
                // This token will be saved in the cookie. 
                // The duration is in milliseconds.
                res.cookie("LegitUser", jwToken, {
                    maxAge: 3600000,
                    httpOnly: true
                });
                res.status(200).json({msg: "A user record was saved."})
            }
        })    
    }
    updateUser(req, res) {
        let data = req.body;
        if(data.userPassword !== null || 
            data.userPassword !== undefined)
            data.userPassword = hashSync(data.userPassword, 15);
        const strQry = 
        `
        UPDATE users
        SET ?
        WHERE userId = ?;
        `;
        //db
        db.query(strQry,[data, req.params.id], 
            (err)=>{
            if(err) throw err;
            res.status(200).json( {msg: 
                "A user was updated"} );
        })    
    }
    deleteUser(req, res) {
        const strQry = 
        `
        DELETE FROM users
        WHERE userId = ?;
        `;
        //db
        db.query(strQry,[req.params.id], 
            (err)=>{
            if(err) throw err;
            res.status(200).json( {msg: 
                "A record was removed from a database"} );
        })    
    }
}
// Event
class Event {
    fetchEvents(req, res) {
        const strQry = `SELECT id, eventName, eventDescription, 
        weightDivision, price, eventIMG
        FROM events;`;
        db.query(strQry, (err, results)=> {
            if(err) throw err;
            res.status(200).json({results: results})
        });
    }
    fetchEvent(req, res) {
        const strQry = `SELECT id, eventName, eventDescription, 
        weightDivision, price, eventIMG
        FROM events
        WHERE id = ?;`;
        db.query(strQry, [req.params.id], (err, results)=> {
            if(err) throw err;
            res.status(200).json({results: results})
        });

    }
    addEvent(req, res) {
        const strQry = 
        `
        INSERT INTO events
        SET ?;
        `;
        db.query(strQry,[req.body],
            (err)=> {
                if(err){
                    res.status(400).json({err: "Unable to insert a new record."});
                }else {
                    res.status(200).json({msg: "Event saved"});
                }
            }
        );    

    }
    updateEvent(req, res) {
        const strQry = 
        `
        UPDATE events
        SET ?
        WHERE id = ?
        `;
        db.query(strQry,[req.body, req.params.id],
            (err)=> {
                if(err){
                    res.status(400).json({err: "Unable to update a record."});
                }else {
                    res.status(200).json({msg: "Event updated"});
                }
            }
        );    

    }
    deleteEvent(req, res) {
        const strQry = 
        `
        DELETE FROM events
        WHERE id = ?;
        `;
        db.query(strQry,[req.params.id], (err)=> {
            if(err) res.status(400).json({err: "The record was not found."});
            res.status(200).json({msg: "A event was deleted."});
        })
    }

}

module.exports = {
    User, 
    Event
}