import React, {Component} from 'react';

import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import TabNavigator from 'react-native-tab-navigator'; 
import RouteConfig from '../../../config/RouteConfig';
import ScreenConfig from '../../../config/ScreenConfig';
import StyleConfig from '../../../config/StyleConfig';

import NetModule from '../../../net/NetModule'
import NetApi from '../../../net/NetApi'
import IconConfig from '../../../config/IconConfig'

import Sound from 'react-native-sound';
import {AudioRecorder, AudioUtils} from 'react-native-audio';

class ConsultantAudioRecord extends  React.Component {

  constructor(props) {
    super(props);
    this.state = {
      curstate:"",
      currentTime: 0.0,
      recording: false,
      paused: false,
      stoppedRecording: false,
      finished: false,
      audioPath: AudioUtils.DocumentDirectoryPath + '/test.aac',
      hasPermission: undefined,
    };
   
  };
  static navigationOptions = ({navigation})=>{
    const { navigate } = navigation;
    return{
      title: RouteConfig["ConsultantAudioRecord"].name,
    }
  };


    prepareRecordingPath(audioPath){
      AudioRecorder.prepareRecordingAtPath(audioPath, {
        SampleRate: 22050,
        Channels: 1,
        AudioQuality: "Low",
        AudioEncoding: "aac",
        AudioEncodingBitRate: 32000
      });
    }

    componentDidMount() {
      AudioRecorder.requestAuthorization().then((isAuthorised) => {
        this.setState({ hasPermission: isAuthorised });

        if (!isAuthorised) return;

        this.prepareRecordingPath(this.state.audioPath);

        AudioRecorder.onProgress = (data) => {
          this.setState({currentTime: Math.floor(data.currentTime)});
        };

        AudioRecorder.onFinished = (data) => {
          // Android callback comes in the form of a promise instead.
          if (Platform.OS === 'ios') {
            this._finishRecording(data.status === "OK", data.audioFileURL, data.audioFileSize);
          }
        };
      });
    }

    async _pause(curstate) {
      if (!this.state.recording) {
        this.setState({curstate:"没有录音"})
        console.warn('Can\'t pause, not recording!');
        return;
      }

      try {
        const filePath = await AudioRecorder.pauseRecording();
        this.setState({paused: true,curstate:curstate});
      } catch (error) {
        console.error(error);
      }
    }

    async _resume(curstate) {
      if (!this.state.paused) {
        this.setState({curstate:"没有暂停"})
        console.warn('Can\'t resume, not paused!');
        return;
      }

      try {
        await AudioRecorder.resumeRecording();
        this.setState({paused: false,curstate:curstate});
      } catch (error) {
        console.error(error);
      }
    }

    async _stop(curstate) {
      if (!this.state.recording) {
        this.setState({curstate:"没有录音"})
        console.warn('Can\'t stop, not recording!');
        return;
      }

      this.setState({stoppedRecording: true, recording: false, paused: false,curstate:curstate});

      try {
        const filePath = await AudioRecorder.stopRecording();

        if (Platform.OS === 'android') {
          this._finishRecording(true, filePath);
        }
        return filePath;
      } catch (error) {
        console.error(error);
      }
    }

    async _play(curstate) {
      if (this.state.recording) {
        await this._stop("录音停止");
      }
      else
      {
        await  this.setState({curstate:"播放录音"})
      }
      
      // These timeouts are a hacky workaround for some issues with react-native-sound.
      // See https://github.com/zmxv/react-native-sound/issues/89.
      setTimeout(() => {
        var sound = new Sound(this.state.audioPath, '', (error) => {
          if (error) {
            this.setState({curstate:"无法加载声音文件"})
            console.log('failed to load the sound', error);
          }
        });

        setTimeout(() => {
          
          sound.play((success) => {
            if (success) {
              this.setState({curstate:"播放完成"})
              console.log('successfully finished playing');
            } else {
              this.setState({curstate:"文件损坏"})
              console.log('playback failed due to audio decoding errors');
            }
          });
        }, 100);
      }, 100);
    }

    async _record(curstate) {
      if (this.state.recording) {
        this.setState({curstate:"已经录音"})
        console.warn('Already recording!');
        return;
      }

      if (!this.state.hasPermission) {
        this.setState({curstate:"无法录音"})
        console.warn('Can\'t record, no permission granted!');
        return;
      }

      if(this.state.stoppedRecording){
        this.prepareRecordingPath(this.state.audioPath);
      }

      await this.setState({recording: true, paused: false,curstate:curstate});

      try {
        const filePath = await AudioRecorder.startRecording();
      } catch (error) {
        console.error(error);
      }
    }

    _finishRecording(didSucceed, filePath, fileSize) {
      this.setState({ finished: didSucceed });
      this.setState({curstate:"录音结束"})
      console.log(`Finished recording of duration ${this.state.currentTime} seconds at path: ${filePath} and size of ${fileSize || 0} bytes`);
    }
    _switchbar(){
      if(true==this.state.recording)
      {
      return(
        
            <TabNavigator.Item
                        title={RouteConfig["AudioPause"].name}
                        renderIcon={() => RouteConfig["AudioPause"].icon}
                        //renderSelectedIcon={() => IconConfig.IconDvinationSel}
                        onPress={() => {this.state.paused ? this._resume("录音恢复") : this._pause("录音暂停")} }  
                        titleStyle={StyleConfig.menufont}>  
            </TabNavigator.Item>  
          
      )}
      else if(false==this.state.recording && false==this.state.paused){
        return(<TabNavigator.Item
                        title={RouteConfig["AudioRecord"].name}
                        renderIcon={() => RouteConfig["AudioRecord"].icon}
                        //renderSelectedIcon={() => IconConfig.IconDvinationSel}
                        onPress={() => {this._record(RouteConfig["AudioRecord"].name), this.state.recording}  }  
                        titleStyle={StyleConfig.menufont}>  
        </TabNavigator.Item>  )
      }

    }

    render() {

      return (
        <View style={styles.container}>
          <View style={styles.controls}>
            <Text style={styles.progressText}>{this.state.currentTime}s</Text>
            <Text style={styles.progressText}>{this.state.curstate}</Text>
            
          </View>
          <TabNavigator tabBarStyle={[{height:ScreenConfig.getTabBarHeight()}]}>
          {this._switchbar()}
          
            <TabNavigator.Item
                        title={RouteConfig["AudioPlay"].name}
                        renderIcon={() => RouteConfig["AudioPlay"].icon}
                        //renderSelectedIcon={() => IconConfig.IconDvinationSel}
                        onPress={() => {this._play(RouteConfig["AudioPlay"].name) }}  
                        titleStyle={StyleConfig.menufont}>  
            </TabNavigator.Item>  
            <TabNavigator.Item
                        title={RouteConfig["AudioStop"].name}
                        renderIcon={() => RouteConfig["AudioStop"].icon}
                        //renderSelectedIcon={() => IconConfig.IconDvinationSel}
                        onPress={() => {this._stop(RouteConfig["AudioStop"].name)}}  
                        titleStyle={StyleConfig.menufont}>  
            </TabNavigator.Item>  
            




          </TabNavigator >
        </View>
      );
    }
  }

  var styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    controls: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
    },
    progressText: {
      paddingTop: 50,
      fontSize: 50,

    },
    button: {
      padding: 20
    },
    disabledButtonText: {

    },
    buttonText: {
      fontSize: 20,

    },
    activeButtonText: {
      fontSize: 20,

    }

  });

export default ConsultantAudioRecord;