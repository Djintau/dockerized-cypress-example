# dockerized-cypress-example
Example of using dockerized cypress.

## Basic Usage
First you need to build the image, simply run the following command:  
`docker build -t custom-cypress-image:1.0.0 .`  
Then you can run your tests from docker image like this:  
`docker run -t custom-cypress-image:1.0.0 .`  
  
To run tests on chrome use:  
`docker run -t custom-cypress-image:1.0.0 . --browser chrome`  
To run tests on firefox use:  
`docker run -t custom-cypress-image:1.0.0 . --browser firefox`  

## Advanced usage
If you want to run interactive test runner from docker container, please follow instructions here:  
https://www.cypress.io/blog/2019/05/02/run-cypress-with-a-single-docker-command/#Interactive-mode  
For my project I am running it using:  
`docker run -it -v /tmp/.X11-unix:/tmp/.X11-unix -e DISPLAY --entrypoint cypress custom-cypress-image:1.0.0 open --project .`  
Disclaimer: I tested this only on my mac ;) 
