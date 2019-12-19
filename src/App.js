import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Navigation from './components/Navigation/Navigation.js';
import Logo from './components/Logo/Logo.js';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.js';
import Rank from './components/Rank/Rank.js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition.js';
import './App.css';

const app = new Clarifai.App({
  apiKey: process.env.REACT_APP_CLARIFAI_API_KEY
});

const particlesOptions = {
  "particles": {
    "number": {
      "value": 160,
      "density": {
        "enable": false
      }
    },
    "size": {
      "value": 10,
      "random": true,
      "anim": {
        "speed": 4,
        "size_min": 0.3
      }
    },
    "line_linked": {
      "enable": false
    },
    "move": {
      "random": true,
      "speed": 1,
      "direction": "top",
      "out_mode": "out"
    }
  },
  "interactivity": {
    "events": {
      "onhover": {
        "enable": true,
        "mode": "bubble"
      },
      "onclick": {
        "enable": true,
        "mode": "repulse"
      }
    },
    "modes": {
      "bubble": {
        "distance": 250,
        "duration": 2,
        "size": 0,
        "opacity": 0
      },
      "repulse": {
        "distance": 400,
        "duration": 4
      }
    }
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      boxes: [],
    }
  }

  calculateFaceLocation = (data) => {
    //------------------
    //  MULTI VERSION
    //------------------
    const image = document.getElementById('input-image');
    const width = Number(image.width);
    const height = Number(image.height);

    return data.outputs[0].data.regions.map(face => {
      const faces = face.region_info.bounding_box;
      return {
        leftCol: faces.left_col * width,
        topRow: faces.top_row * height,
        rightCol: width - (faces.right_col * width),
        bottomRow: height - (faces.bottom_row * height)
      }
    });

    //------------------
    //  SINGLE VERSION
    //------------------
    // const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    // const image = document.getElementById('input-image');
    // const width = Number(image.width);
    // const height = Number(image.height);
    // // console.log(width, height);

    // return {
    //   leftCol: clarifaiFace.left_col * width,
    //   topRow: clarifaiFace.top_row * height,
    //   rightCol: width - (clarifaiFace.right_col * width),
    //   bottomRow: height - (clarifaiFace.bottom_row * height)
    // }
  }

  displayFaceBox = (boxes) => {
    this.setState({boxes});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});

    app.models
      .predict(
        Clarifai.FACE_DETECT_MODEL, 
        this.state.input)
      .then((response) => this.displayFaceBox(this.calculateFaceLocation(response)))
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div className="App">
        <Particles className='particles' params={particlesOptions} />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm 
          onInputChange={this.onInputChange} 
          onButtonSubmit={this.onButtonSubmit}
        />
        <FaceRecognition 
          imageUrl={this.state.imageUrl} 
          boxes={this.state.boxes}
        />
      </div>
    );
  }
}

export default App;
