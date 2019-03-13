import Taro, { Component } from '@tarojs/taro'
import { View, Input } from '@tarojs/components'
import { AtModal, AtButton, AtAccordion } from "taro-ui"

import './index.scss'

class Index extends Component {

  constructor (props) {
    super(props)
    this.state = {
      salary: '',
      free: 5000, // 免税额度
      funds: 3500, // 公积金基数
      fundsRate: 12, // 公积金交的比例
      socials: 3500, // 社保基数
      medicalRate: 2, // 医疗缴存比例
      oldRate: 8, // 养老缴存比例
      unemployRate: '0.5', // 失业缴存比例
      hurtRate: 0, // 工伤缴存比例
      birthRate: 0, // 生育缴存比例
      less: 0, // 五项减免额度
      showModal: false,
      result: '',
      open: false,
    }
    this.doCalc = this.doCalc.bind(this)
    this.hideModal = this.hideModal.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  config = {
    navigationBarTitleText: '个税计算器'
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  handleChange (target, e) {
    this.setState({
      [target]: e.target.value
    })
  }

  hideModal () {
    this.setState({
      showModal: false
    })
  }

  handleClick () {
    this.setState({
      open: !this.state.open
    })
  }

  doCalc () {
    const { salary, free, funds, less, socials, fundsRate, medicalRate, oldRate, hurtRate, birthRate, unemployRate} = this.state
    if (!salary) {
      Taro.showToast({
        title: '工资不能为空哦',
        icon: 'none'
      });
      return;
    }
    let result = salary
    const payFunds = parseInt(funds) * parseFloat(fundsRate) * 0.01
    const socialRate = (parseFloat(medicalRate) + parseFloat(oldRate) + parseFloat(hurtRate) + parseFloat(birthRate) + parseFloat(unemployRate)) * 0.01
    const paySocials = parseInt(socials) * socialRate
    let taxPay = 0

    if (salary - free > 0) {
      // 预扣预缴
      const taxNum = salary - free - payFunds - paySocials - less
      result = salary - payFunds - paySocials // 社保、公积金扣除
      // 需要交税
      if (taxNum > 0) {
        if (taxNum < 36000) {
          taxPay = taxNum * 0.03
        } else if (taxNum > 36000 && taxNum < 144000) {
          // 10% - 2520
          taxPay = taxNum * 0.1 - 2520;
        }
        result -= taxPay
      } 
    }
    this.setState({
      result: `税后：${result}
      公积金：${payFunds}
      社保：${paySocials}
      纳税：${taxPay}
      `,
      showModal: true
    })
  }

  onShareAppMessage() {
    // 分享的回调
    return {
      title: '送你一款好用的个人所得税计算工具！',
      path: '/pages/tax/index',
    }
  }

  render () {
    const { salary, free, funds, fundsRate, medicalRate, oldRate, birthRate, unemployRate, hurtRate, less, open, socials, showModal, result} = this.state
    return (
      <View className='tax'>
        <View className='at-row at-row__align--center'>
          <View className='label'>税前月薪</View>
          <View className='at-col'>
            <Input type='number' placeholder='输入你的税前月薪' value={salary} onChange={this.handleChange.bind(this, 'salary')}></Input>
          </View>
        </View>
        <View className='at-row at-row__align--center'>
          <View className='label'>免税额度</View>
          <View className='at-col'>
            <Input type='number' placeholder='输入免税额度'  value={free} onChange={this.handleChange.bind(this, 'free')}></Input>
          </View>
        </View>
        <View className='at-row at-row__align--center'>
          <View className='label'>公积金基数</View>
          <View className='at-col'>
            <Input type='number' placeholder='输入公积金缴纳基数'  value={funds} onChange={this.handleChange.bind(this, 'funds')}></Input>
          </View>
        </View>
        <View className='at-row at-row__align--center'>
          <View className='label'>社保基数</View>
          <View className='at-col'>
            <Input type='number' placeholder='输入社保缴纳基数'  value={socials} onChange={this.handleChange.bind(this, 'socials')}></Input>
          </View>
        </View>
        <View className='at-row at-row__align--center'>
          <View className='label'>专项减免额</View>
          <View className='at-col'>
            <Input type='number' placeholder='输入五项减免总额'  value={less} onChange={this.handleChange.bind(this, 'less')}></Input>
          </View>
        </View>

        <AtAccordion 
          open={open}
          onClick={this.handleClick}
          title='五险一金'
        >
          <View className='at-row at-row__align--center'>
            <View className='label'>公积金</View>
            <View className='at-col'>
              <Input type='number' value={fundsRate} onChange={this.handleChange.bind(this, 'fundsRate')}></Input>
            </View>
            <View className='percent'>%</View>
          </View>
          <View className='at-row at-row__align--center'>
            <View className='label'>医疗</View>
            <View className='at-col'>
              <Input type='number' value={medicalRate} onChange={this.handleChange.bind(this, 'medicalRate')}></Input>
            </View>
            <View className='percent'>%</View>
          </View>
          <View className='at-row at-row__align--center'>
            <View className='label'>养老</View>
            <View className='at-col'>
              <Input type='number' value={oldRate} onChange={this.handleChange.bind(this, 'oldRate')}></Input>
            </View>
            <View className='percent'>%</View>
          </View>
          <View className='at-row at-row__align--center'>
            <View className='label'>失业</View>
            <View className='at-col'>
              <Input type='number' value={unemployRate} onChange={this.handleChange.bind(this, 'unemployRate')}></Input>
            </View>
            <View className='percent'>%</View>
          </View>
          <View className='at-row at-row__align--center'>
            <View className='label'>工伤</View>
            <View className='at-col'>
              <Input type='number' value={hurtRate} onChange={this.handleChange.bind(this, 'hurtRate')}></Input>
            </View>
            <View className='percent'>%</View>
          </View>
          <View className='at-row at-row__align--center'>
            <View className='label'>生育</View>
            <View className='at-col'>
              <Input type='number' value={birthRate} onChange={this.handleChange.bind(this, 'birthRate')}></Input>
            </View>
            <View className='percent'>%</View>
          </View>
        </AtAccordion>
        
        <AtButton type='primary' className='btn-calc' onClick={this.doCalc}>开始计算</AtButton>
        <AtModal
          isOpened={showModal}
          title='结果'
          cancelText=''
          confirmText='确认'
          onConfirm={this.hideModal}
          content={result}
        />
      </View>
    )
  }
}

export default Index