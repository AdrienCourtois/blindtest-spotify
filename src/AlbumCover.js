import React, { Component } from 'react';
import './AlbumCover.css';

class AlbumCover extends Component{
    render(){
        return (<img src={this.props.track} alt="Illustration de l'album" style={{ width: 400, height: 400 }} />);
    }
}

export default AlbumCover;