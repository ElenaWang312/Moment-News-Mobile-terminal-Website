//组件基于类开发，使用面向对象开发

let{Component}=React;
let{render}=ReactDOM;

class Util extends Component{
    ajax(url,fn){
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange=function (){
            if(xhr.readyState===4){
                if(xhr.status===200){
                    fn(JSON.parse(xhr.responseText))
                }
            }
        }
        xhr.open("GET",url,true);
        xhr.send(null)
    }
}
//列表页组件
class List extends Util{
    getimage(){
       return this.props.img.map( (value,index) =>{
           return(
           <li key={index}>
               <img src={value.img} alt=""/>
               <p>{value.news}</p>
           </li>
          )
        }
      )
    }
    getcircle(){
        return this.props.img.map((value,index) =>{
            return (
                <span key={index} style={{right:index*12+10+"px"}}  className="moren"></span>
            )
        })
    }
    carrousel(){
        return(
               <ul className="carrou" ref="carcontainer">{this.getimage()}</ul>
        )
    }
  creatList(){
     return this.props.data.map( (value,index) =>{
       return (
           <li data-id={value.id} onClick={this.goDetail.bind(this,value.id)} key={index} className="newsli">
                 <img src={value.img}/>
                 <h3>{value.title}</h3>
                 <p>{value.content}</p>
                 <span>{"评论:"+value.comment}</span>
          </li>
       )
     } )
  }
  goDetail(id){
      //console.log(this)
      //console.log(this.props)
     this.props.showDetail(id)
  }
	render(){
	    return (
        <div className="list">
            <div className="carrousel">{this.carrousel()}</div>
            <div className="clear"></div>
            <ul>{this.creatList()}</ul>
        </div>
      )
	}
    componentDidMount(){
        let ul=this.refs.carcontainer
        //let lis=ul.childNodes
        let num =3
        let lock=this.props.dis
        new Carrousel(ul,num,lock)
    }
    //ComponentWillUnmount(){
    //  console.log("销毁了")
    //}
}
//详情页组件
class Detail extends Component{
  goComment(id){
      this.props.showComment(id)
  }
	render(){
        let content={
            __html:this.props.data.content
        }
	   return (
       <div className="detail">
           <h1>{this.props.data.title}</h1>
           <p className="detail-comment"><span>{"评论数：" + this.props.data.comment}</span></p>
           <img src={this.props.data.img}/>
           <p className="detail-content" dangerouslySetInnerHTML={content}></p>
           <div className="btn" onClick={this.goComment.bind(this,this.props.data.id)}>查看更多评论</div>
       </div>
     )
	}
}


//评论页组件继承util;
class Comment extends Util{
  constructor(props){
      super(props)
      this.state={
        list:this.props.data.list || [],
        id:this.props.data.id || "",

      }
  }
    componentWillReceiveProps(props){
        this.state={
            list:props.data.list ||[],
            id:props.data.id||""
        }
    }
  createCommentList(){
    return this.state.list.map((value,index) => (
         <li key={index}>
           <h3>{value.user}</h3>
           <p>{value.content}</p>
           <span>{value.time}</span>
         </li>
        ) )
  }
  //submitData
    submitData(){
        var inp = this.refs.inputmsg
            var val = inp.value;
            // 提交的数据有四个字段：新闻id，用户名，时间，内容
            let time = new Date();
            let data = {
                id: this.state.id,
                user: 'Elena',
                time: '刚刚  ' + time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds(),
                content: val
            }
        this.ajax("data/addComment.json?date="+time,res=>{
            if(res && res.errno===0){
                //数据直接保存在数组中不要操作数组成员，要定义新数组进行覆盖
                let nlist=this.state.list
                nlist.unshift(data)
                //console.log(this);
                //必须使用setState更新属性数据，才可进入存在期，才能更新数据
                this.setState({
                    list:nlist
                })
                    inp.value=""
                   alert("评论提交成功");
                //this.render()
                //console.log(this.state.list)
            }
        })
    }
    render() {
        // console.log(this.props)
        return (
            <div className="comment">
                <div className="container">
                    <div className="message">
                        <textarea ref="inputmsg" placeholder="文明上网，理性发言！"></textarea>
                    </div>
                    <div className="btn clearfix">
                        <span onClick={this.submitData.bind(this)}>提交</span>
                    </div>
                </div>
                <ul>{this.createCommentList()}</ul>
            </div>
        )
    }
}
class Header extends Component{
	render(){
	  return (
          <header className="header">
				<div className="login"></div>
				<div className="go-back" onClick={this.props.goback}><span className="arrow"><span className="arrow"></span></span></div>
				<h1>一刻新闻</h1>
			</header>
	   )
	}
}

 class App extends Util{
     constructor(props){
     super(props)
         this.state={
             page:this.props.page,
             list:[],
             detail:{},
             comment:{},
             img:[]
         }
   }
  goDetail(id){
    this.ajax("data/detail.json?id="+id,(res) => {
      if(res && res.errno === 0){

          this.setState({
          detail:res.data,
          page:"detail"
        })
      }
    })
  }
  goComment(id){
   this.ajax("data/comment.json?id="+id,(res)=>{
       if(res && res.errno === 0){

         this.setState({
         comment:res.data,
         page:"comment"
         })
       }
   })
  }
     goBack(){
         switch(this.state.page) {
             case "comment":
                 this.setState({
                     page:"detail"
                 })
                 break
             case "detail":
                 this.setState({
                     page:"list"
                 })
                 break
             case "list":
                 return
         }

     }
	render(){
	 return(
	     <div className="main">
             <Header goback={this.goBack.bind(this)}></Header>
           <div style={{display:this.state.page === 'list' ? 'block' : "none"}}>
             <List data={this.state.list} showDetail={this.goDetail.bind(this)} img={this.state.img} dis={this.state.page==="list"?true : false}></List>
           </div>
            <div style={{display:this.state.page === "detail" ? "block" : "none"}}>
             <Detail data={this.state.detail} showComment={this.goComment.bind(this)}></Detail>
           </div>
            <div style={{display:this.state.page === "comment" ? "block" : "none"}}>
             <Comment data={this.state.comment}></Comment>
           </div>
         </div>
	 )
	}

     componentDidMount(){
         //注意绑定this
         //this.ajax("data/list.json",function (res){
         //    console.log(res.data)
         //    if(res && res.errno===0){
         //        console.log(this);
         //        this.setState({
         //            list:res.data
         //        })
         //    }
         //}.bind(this));
     //方法2箭头函数
         this.ajax("data/list.json",res => {
             if(res && res.errno ===0){
                 this.setState({
                     list:res.data
                 })
             }
         })
         this.ajax("data/img.json",res =>{
             if(res && res.errno === 0){
                 this.setState({
                    img:res.data
                 })

             }
         })

     }
 }

render(<App page="list"/>,document.getElementById("app"))