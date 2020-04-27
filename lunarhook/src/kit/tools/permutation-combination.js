import React, { Component } from 'react';
import {StyleSheet,View, Text,Platform,FlatList,KeyboardAvoidingView,Button} from 'react-native';
import { InputItem,WhiteSpace, List ,Switch } from '@ant-design/react-native';
import RouteConfig from './../../config/RouteConfig'


var explaion = new Array()
explaion.push("")
explaion.push("排列")
explaion.push("计数问题的背景下，排列顺序计算器是很重要的，是不允许重复或复发的安排。被写为NPR一次取r的n个不同的点的数目排列。因为被设置的对象的数目不能超过总数量。有n个 ！（n的阶乘）n个符号的排列。一r-n个符号的排列，其中的r是一个置换。有n/（N - R）！不同的R-n个符号的排列。 Â排列代表NPR和计算公式")
explaion.push("")
explaion.push("合并")
explaion.push("组合是一种方法选择多个项目或符号的一组或一个数据集，其中的顺序无关紧要。 nCr和组合表示的公式计算")
explaion.push("nCr = n!/(r!(n - r)!")
explaion.push("r分别组合可以被布置在r！方式不同。r-置换的数目是等于r的组合的数量乘以 r！")
explaion.push("")
explaion.push("阶乘")
explaion.push("被用来计算阶乘的排列（NPR）和组合（nCr的）。阶乘是从1到给定的数字乘以给定数量的连续整数的结果。这是用感叹号：N！它被定义为")
explaion.push("0! = 1")
explaion.push("1! = 1")
explaion.push("2! = 2 x 1 = 2")
explaion.push("3! = 3 x 2 x 1 = 6")
explaion.push("4! = 4 x 3 x 2 x 1 = 24")
explaion.push("5! = 5 x 4 x 3 x 2 x 1 = 120 等")

export default class extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
        n:"",
        r:"",
        permutation:"",
        combination:""
    };
  }

  static navigationOptions = ({navigation})=>{
    const { navigate } = navigation;
    return{
    title: RouteConfig["permutationcombination"].name,
    }
  };

  keyExtractor = (item,index) => index.toString()

  renderItem(item) {
    return (
        <Text key={item.item}>{item.item}</Text>
    );
  }

  render () {
  
      let content =  (
      <View style={styles.container}>
      <FlatList  
              data={explaion}
              //extraData={this.state.extraData}
              keyExtractor={this.keyExtractor}
              renderItem={this.renderItem}
              />
        <Text>N（采样点设置）</Text>
        <InputItem
            clear
            type="number"
            value={this.state.n}
            onChange={(value: any) => {
              this.setState({n:(value)})
            }}
            extra="N（采样点设置）"
          >
          数字:
          </InputItem>
        <Text>R（采样点)</Text>
        <InputItem
            clear
            type="number"
            value={this.state.r}
            onChange={(value: any) => {
              this.setState({r:(value)})
            }}
            extra="R（采样点)"
          >
          数字:
          </InputItem>
          <WhiteSpace size="xl" />
        <Text>排列数( nPr ):{this.state.permutation}</Text>
        <Text>组合数( nCr ):{this.state.combination}</Text>

        <Button
          onPress={()=>this.calc()}
          title="计算"/>
      </View>
    );
    if (Platform.OS === 'ios') {
      return (
          <KeyboardAvoidingView
              behavior="padding"
              style={[{flex:1}]}
              keyboardVerticalOffset={this.props.keyboardVerticalOffset || 64}
          >
              {content}
          </KeyboardAvoidingView>
      );
    } else {
      return content;
    }
  }
  calc()
  {
      console.log("calc")
    var n=this.state.n
	var r=this.state.r

    var nf=1;
	var rf=1;
	var nrf=1;
	for(var k=r;k>=1;k--){
		rf=rf*k;
	}
	for(var i=n;i>=1;i--){
			nf=nf*i;
	}

	for(var j=(n-r);j>=1;j--){
		nrf=nrf*j;
	}
	var npr=nf/nrf;
    var ncr=npr/rf;
    this.setState({permutation:npr})
    this.setState({combination:ncr})

  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});