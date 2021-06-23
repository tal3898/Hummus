![empty student card](https://user-images.githubusercontent.com/40955154/123157478-42160900-d473-11eb-9cb8-43ebe7934bc8.png)

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Do in next upgrade
1) remove all dots '.' in json of all entities. because of resolved issue #34, and cant have dots in json.
2) becuse of issue #34, support loading scenarios with jsontoedit as string

## Adding Sub Entity To Hummus
Sometime the version of the data, is changed. sub entities are add, Fields are changed...
And as a result, you will need to update the Hummus.

To do so there are simple steps.
If you only want to add fields, just enter the folder `src/jsonFormats/` , and open the relevant file (entity_version).
**add the json of the sub entity to the right place.**
Thats it  :)

the sub entity is in the hummus, and can be sent.

If you want to add data on the sub entity fields, like fields with timestamp, info message, is field required... do the following:

## Things to change before upload a new version in CTS

1) Copy the directories globals, and jsonFormats

2) Copy the function createStepTemplate

3) Copy the Dockerfile, and the .gitlab-ci

4) Copy the .env file

5) Update the functions `sendSingleStepToNg` and `sendSingleStepToNg`, that will send the actual json

6) Update the App.js first step initialize.

7) Update the Easter Egg path.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
The client runs on `localhost:3000`, and the server runs on `localhost:5000`.


### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment
