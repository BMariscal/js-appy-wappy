import React from 'react';
import "react-popupbox/dist/react-popupbox.css"

const axios = require('axios');
require('dotenv').config();

const LOAD_STATE = {
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
  LOADING: 'LOADING'
};


class Popup extends React.Component {
  render() {
    return (
      <div className='popup'>

        <div className="container">
         <img src={this.props.image.raw} alt="" className="media__obj" />
        </div>
      </div>
    );
  }
}

class PhotoApp extends React.Component{
  constructor() {
    super();
    this.state = {
      photos: [],
      totalPhotos: 0,
      perPage: 5,
      currentPage: 1,
      loadState: LOAD_STATE.LOADING,
    }
  }

  componentDidMount() {
    this.fetchPhotos(this.state.currentPage);
  }

  fetchPhotos(page) {
    var self = this;
    const { perPage } = this.state;
    const { appId} = this.props;
    const options = {
      params: {
        client_id: appId,
        page: page,
        per_page: perPage
      }
    };

    this.setState({ loadState: LOAD_STATE.LOADING });
    const baseUrl = "https://api.unsplash.com/photos"
    axios.get(baseUrl, options)
      .then((response) => {
        self.setState({
          photos: response.data,
          totalPhotos: parseInt(response.headers['x-total']),
          currentPage: page,
          loadState: LOAD_STATE.SUCCESS,
          showPopup: false,
        });
      })
      .catch(() => {
        this.setState({ loadState: LOAD_STATE.ERROR });
      });
  }

  render() {
    return (
      <div className="app">
        <Pagination
          current={this.state.currentPage}
          total={this.state.totalPhotos}
          perPage={this.state.perPage}
          onPageChanged={this.fetchPhotos.bind(this)}
        />
        {this.state.loadState === LOAD_STATE.LOADING
            ? <div className="loader"></div>
            : <List data={this.state.photos} />
          }

      </div>
    )
  }
}

class ListItem extends React.Component{
  constructor() {
    super();
    this.state = {
    showPopup: false
    }
   }
    togglePopup() {
    this.setState({
      showPopup: !this.state.showPopup
    });
  }
    render(){
      return (
        <div key={this.props.photo.id} className="grid__item card">
          <div className="card__body" onClick={()=> this.togglePopup()}>
            <img src={this.props.photo.urls.small} />
            {this.state.showPopup ?
              <Popup
                image={this.props.photo.urls}
                closePopup={()=> this.togglePopup()}
              />
              : null
            }
          </div>
          <div className="card__footer media">
            <div className="media__body">
              <a href={this.props.photo.user.portfolio_url} target="_blank"><button className="button">📷</button></a>
            </div>
          </div>
        </div>
      )
  }
}

const List = ({ data }) => {
  var items = data.map(photo => <ListItem key={photo.id} photo={photo} />);
  return (
    <div className="grid">
      { items }
    </div>
  )
}

class Pagination extends React.Component {
  pages() {
    var pages = [];
    for(var i = this.rangeStart(); i <= this.rangeEnd(); i++) {
      pages.push(i)
    };
    return pages;
  }

  rangeStart() {
    var start = this.props.current - this.props.pageRange;
    return (start > 0) ? start : 1
  }

  rangeEnd() {
    var end = this.props.current + this.props.pageRange;
    var totalPages = this.totalPages();
    return (end < totalPages) ? end : totalPages;
  }

  totalPages() {
    return Math.ceil(this.props.total / this.props.perPage);
  }

  nextPage() {
    return this.props.current + 1;
  }

  prevPage() {
    return this.props.current - 1;
  }

  hasFirst() {
    return this.rangeStart() !== 1
  }

  hasLast() {
    return this.rangeEnd() < this.totalPages();
  }

  hasPrev() {
    return this.props.current > 1;
  }

  hasNext() {
    return this.props.current < this.totalPages();
  }

  changePage(page) {
    this.props.onPageChanged(page);
  }

  render() {
    return (
      <div className="pagination">
        <div className="pagination__left">
          <a href="#" className={!this.hasPrev() ? 'hidden': ''}
            onClick={e => this.changePage(this.prevPage())}
          >Prev</a>
        </div>

        <div className="pagination__mid">
          <ul>
            <li className={!this.hasFirst() ? 'hidden' : ''}>
              <a href="#" onClick={e => this.changePage(1)}>1</a>
            </li>
            <li className={!this.hasFirst() ? 'hidden' : ''}>...</li>
            {
              this.pages().map((page, index) => {
                return (
                  <li key={index}>
                    <a href="#"
                      onClick={e => this.changePage(page)}
                      className={ this.props.current == page ? 'current' : '' }
                    >{ page }</a>
                  </li>
                );
              })
            }
            <li className={!this.hasLast() ? 'hidden' : ''}>...</li>
            <li className={!this.hasLast() ? 'hidden' : ''}>
              <a href="#" onClick={e => this.changePage(this.totalPages())}>{ this.totalPages() }</a>
            </li>
          </ul>
        </div>

        <div className="pagination__right">
          <a href="#" className={!this.hasNext() ? 'hidden' : ''}
            onClick={e => this.changePage(this.nextPage())}
          >Next</a>
        </div>
      </div>
    );
  }
};

Pagination.defaultProps = {
  pageRange: 2
}

export default PhotoApp;
