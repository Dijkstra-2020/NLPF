// routes/users.js

var express = require('express');
var secured = require('../lib/middleware/secured');
var router = express.Router();
const path = require('path');
const { database, Post, Candidature, Message, Profil } = require('../database');
var app = express();

app.use(express.static(path.join(__dirname, 'public')));
/* GET user profile. */
router.get('/profile', secured(), function (req, res, next) {
    res.sendFile(path.join(__dirname, '../public/profile.html'));
});

router.get('/profiles', secured(), function (req, res, next) {
    const { _raw, _json, ...userProfile } = req.user;
    var id = userProfile['user_id'];
    Profil.findOne({
        where: {
            auth_id: id
        }
    }).then(function (profil) {
        res.json(profil);
    });
});

/* GET user profile JSON. */
router.get('/user', secured(), function (req, res, next) {
    const { _raw, _json, ...userProfile } = req.user;
    res.send(userProfile);
});

/* GET user role JSON. */
router.get('/role', secured(), function (req, res, next) {
    const { _raw, _json, ...userProfile } = req.user;
    var request = require("request");
    var id = userProfile['user_id'];
    var url =  'https://totonio.eu.auth0.com/api/v2/users/' + id + '/roles';
    var options = {
        method: 'GET',
        url: url,
        headers: {authorization: "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1qSXlOelV6T1RZd05VWkZORGsxUlRBelJqSTRRVFpETVVWQlJUazFSRVExUTBJd01EVTBOUSJ9.eyJpc3MiOiJodHRwczovL3RvdG9uaW8uZXUuYXV0aDAuY29tLyIsInN1YiI6InRHV3YwRHZIMjZBZXoxMFNHZEpzc2JpN25WNjRZdldVQGNsaWVudHMiLCJhdWQiOiJodHRwczovL3RvdG9uaW8uZXUuYXV0aDAuY29tL2FwaS92Mi8iLCJpYXQiOjE1Nzg4NDY0NzYsImV4cCI6MTU4MTQzODQ3NiwiYXpwIjoidEdXdjBEdkgyNkFlejEwU0dkSnNzYmk3blY2NFl2V1UiLCJzY29wZSI6InJlYWQ6Y2xpZW50X2dyYW50cyBjcmVhdGU6Y2xpZW50X2dyYW50cyBkZWxldGU6Y2xpZW50X2dyYW50cyB1cGRhdGU6Y2xpZW50X2dyYW50cyByZWFkOnVzZXJzIHVwZGF0ZTp1c2VycyBkZWxldGU6dXNlcnMgY3JlYXRlOnVzZXJzIHJlYWQ6dXNlcnNfYXBwX21ldGFkYXRhIHVwZGF0ZTp1c2Vyc19hcHBfbWV0YWRhdGEgZGVsZXRlOnVzZXJzX2FwcF9tZXRhZGF0YSBjcmVhdGU6dXNlcnNfYXBwX21ldGFkYXRhIGNyZWF0ZTp1c2VyX3RpY2tldHMgcmVhZDpjbGllbnRzIHVwZGF0ZTpjbGllbnRzIGRlbGV0ZTpjbGllbnRzIGNyZWF0ZTpjbGllbnRzIHJlYWQ6Y2xpZW50X2tleXMgdXBkYXRlOmNsaWVudF9rZXlzIGRlbGV0ZTpjbGllbnRfa2V5cyBjcmVhdGU6Y2xpZW50X2tleXMgcmVhZDpjb25uZWN0aW9ucyB1cGRhdGU6Y29ubmVjdGlvbnMgZGVsZXRlOmNvbm5lY3Rpb25zIGNyZWF0ZTpjb25uZWN0aW9ucyByZWFkOnJlc291cmNlX3NlcnZlcnMgdXBkYXRlOnJlc291cmNlX3NlcnZlcnMgZGVsZXRlOnJlc291cmNlX3NlcnZlcnMgY3JlYXRlOnJlc291cmNlX3NlcnZlcnMgcmVhZDpkZXZpY2VfY3JlZGVudGlhbHMgdXBkYXRlOmRldmljZV9jcmVkZW50aWFscyBkZWxldGU6ZGV2aWNlX2NyZWRlbnRpYWxzIGNyZWF0ZTpkZXZpY2VfY3JlZGVudGlhbHMgcmVhZDpydWxlcyB1cGRhdGU6cnVsZXMgZGVsZXRlOnJ1bGVzIGNyZWF0ZTpydWxlcyByZWFkOnJ1bGVzX2NvbmZpZ3MgdXBkYXRlOnJ1bGVzX2NvbmZpZ3MgZGVsZXRlOnJ1bGVzX2NvbmZpZ3MgcmVhZDpob29rcyB1cGRhdGU6aG9va3MgZGVsZXRlOmhvb2tzIGNyZWF0ZTpob29rcyByZWFkOmVtYWlsX3Byb3ZpZGVyIHVwZGF0ZTplbWFpbF9wcm92aWRlciBkZWxldGU6ZW1haWxfcHJvdmlkZXIgY3JlYXRlOmVtYWlsX3Byb3ZpZGVyIGJsYWNrbGlzdDp0b2tlbnMgcmVhZDpzdGF0cyByZWFkOnRlbmFudF9zZXR0aW5ncyB1cGRhdGU6dGVuYW50X3NldHRpbmdzIHJlYWQ6bG9ncyByZWFkOnNoaWVsZHMgY3JlYXRlOnNoaWVsZHMgZGVsZXRlOnNoaWVsZHMgcmVhZDphbm9tYWx5X2Jsb2NrcyBkZWxldGU6YW5vbWFseV9ibG9ja3MgdXBkYXRlOnRyaWdnZXJzIHJlYWQ6dHJpZ2dlcnMgcmVhZDpncmFudHMgZGVsZXRlOmdyYW50cyByZWFkOmd1YXJkaWFuX2ZhY3RvcnMgdXBkYXRlOmd1YXJkaWFuX2ZhY3RvcnMgcmVhZDpndWFyZGlhbl9lbnJvbGxtZW50cyBkZWxldGU6Z3VhcmRpYW5fZW5yb2xsbWVudHMgY3JlYXRlOmd1YXJkaWFuX2Vucm9sbG1lbnRfdGlja2V0cyByZWFkOnVzZXJfaWRwX3Rva2VucyBjcmVhdGU6cGFzc3dvcmRzX2NoZWNraW5nX2pvYiBkZWxldGU6cGFzc3dvcmRzX2NoZWNraW5nX2pvYiByZWFkOmN1c3RvbV9kb21haW5zIGRlbGV0ZTpjdXN0b21fZG9tYWlucyBjcmVhdGU6Y3VzdG9tX2RvbWFpbnMgcmVhZDplbWFpbF90ZW1wbGF0ZXMgY3JlYXRlOmVtYWlsX3RlbXBsYXRlcyB1cGRhdGU6ZW1haWxfdGVtcGxhdGVzIHJlYWQ6bWZhX3BvbGljaWVzIHVwZGF0ZTptZmFfcG9saWNpZXMgcmVhZDpyb2xlcyBjcmVhdGU6cm9sZXMgZGVsZXRlOnJvbGVzIHVwZGF0ZTpyb2xlcyByZWFkOnByb21wdHMgdXBkYXRlOnByb21wdHMgcmVhZDpicmFuZGluZyB1cGRhdGU6YnJhbmRpbmcgcmVhZDpsb2dfc3RyZWFtcyBjcmVhdGU6bG9nX3N0cmVhbXMgZGVsZXRlOmxvZ19zdHJlYW1zIHVwZGF0ZTpsb2dfc3RyZWFtcyIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyJ9.H7kgr106Im9DVUZvCWividDH_2AitVwxqn1_0MT3P5KB4SILk23P3FllhOpjY9eMPfTTMqC7vHULdgsNyvDr3UW0kvcX0Y_ipaGEzqQ8mfTJpGavT5Nu3KtDS8MRXwCJEjzVOMr-Wf2YVBYH9ol-yG3xpi-fWwH-UGd4mUFnFZPEi79PG3MgJ0KbFssWRmlp2PEOhXQj8D6A04cb2kvTKYQ1EgU89TbZ_MH9KT7prmAQFC4h04MiCnOAWa-2K5-Ti07A-gznmX_puuagXWO-XWDjP0tJ7AQ9f9IIlwv_KW1vUmwxIUGDyjhrH5etfRXjWiSYl20O8xq8u_Nrisrq0w"}
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        console.log(body);
        res.send(body);
    });
});

router.post('/candidature', secured(), function (req, res, next) {
    const { _raw, _json, ...userProfile } = req.user;
    var id = userProfile['user_id'];
    console.log(req.body);
    var c =  Candidature.create({
        user_id: id,
        postId: req.body.post_id
    });
    console.log(c);
    return c;
});

router.get('/candidature', secured(), function (req, res, next) {
    const { _raw, _json, ...userProfile } = req.user;
    var id = userProfile['user_id'];
    Candidature.findAll({
        where: {
            user_id: id
        }
    }).then(function (users) {
        res.json(users);
    });
});

router.post('/updateprofil', secured(), function (req, res, next) {
    console.log(req.body);
    Profil.update
    (
        {
            "familyName": req.body.familyName,
            "givenName": req.body.givenName,
            "email": req.body.email,
            "description": req.body.description,
            "skill": req.body.skill
        },
        {
            where: {auth_id: req.body.auth_id}
        },

    ).then((result) => {
        console.log(result);
    });
    res.sendStatus(200);
});

module.exports = router;