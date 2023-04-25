import './App.css';

import BookPreview from './BookPreview';
import Recommendations from './Recommendations';
import ImageMap from './ImageMap';
import * as React from 'react';
import {FileUploader} from 'baseui/file-uploader';
import axios from 'axios';

import { Client as Styletron } from 'styletron-engine-atomic';
import { Provider as StyletronProvider } from 'styletron-react';
import { DarkTheme, BaseProvider, useStyletron, LocaleProvider } from 'baseui';
import {Grid, Cell, BEHAVIOR} from 'baseui/layout-grid';
import { MessageCard } from "baseui/message-card";
import {Card, StyledAction, StyledBody} from 'baseui/card';
import { Tabs, Tab } from "baseui/tabs-motion";
import { Drawer } from "baseui/drawer";
import AddToHomeScreen from '@ideasio/add-to-homescreen-react';
import { Button } from "baseui/button";
import  {Tweet} from 'react-twitter-widgets'

// import { MobileHeader } from "baseui/mobile-header";

import ReactGA from 'react-ga';

const TRACKING_ID = "G-NQ25FXXTTT"; // OUR_TRACKING_ID
ReactGA.initialize(TRACKING_ID);
ReactGA.pageview(window.location.pathname + window.location.search);
const engine = new Styletron();

const Outer = ({children}) => {
  const [css] = useStyletron();
  return (
    <div
      className={css({
      })}
    >
      {children}
    </div>
  );
};

const Inner = ({children}) => {
  const [css] = useStyletron();
  return (
    <div
      className={css({
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '.5rem',
      })}
    >
      {children}
    </div>
  );
};

const fileUploaderLocale = {
  "fileuploader": {
    "dropFilesToUpload": "",
    "or": "",
    "browseFiles": "Upload Bookshelf Photo 📷",
    "retry": "Retry Upload",
    "cancel": "Cancel"
  }
};


export default function ImageUploader() {
  const [isUploading, setIsUploading] = React.useState(false);
  const [bookPreviews, setBookPreviews] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState(false);
  const [imageMap, setImageMap] = React.useState(false);
  const [activeKey, setActiveKey] = React.useState("0");
  const [isOpen, setIsOpen] = React.useState(false);
  // const apiUrl = "http://localhost:8080";
  const apiUrl = "https://api.b3vr.com";

  const timeoutId = React.useRef(null);
  function reset() {
    setIsUploading(false);
    clearTimeout(timeoutId.current);
  }

  function startProgress() {
    setIsUploading(true);
    // timeoutId.current = setTimeout(reset, 10000);
  }

  function displayImageMap(file, books) {
    var _URL = window.URL || window.webkitURL;
    var objectUrl = _URL.createObjectURL(file);
    displayImageMapUrl(objectUrl, books);
  }

  function displayImageMapUrl(url, books) {
    var img = new Image();
    img.onload = function () {
        setImageMap(ImageMap(url, this.width, this.height, books));
    };
    img.src = url;
    return img;
  }


  function uploadImage(files) {
      ReactGA.event({
        category: 'Home',
        action: 'Image upload started'
      });
    setBookPreviews([]);
    const formData = new FormData();
    formData.append(
      "file",
      files[0],
      files[0].name
    );


    axios.post(apiUrl, formData)
    .then(res => {
      const previews = []
      ReactGA.event({
        category: 'Home',
        action: 'Image uploaded successful'
      });

      previews.push(Recommendations("Your AI wingman says...", res.data.results.openai.summary))
      previews.push(Recommendations("Recommendation: ", res.data.results.openai.recommendation))

      for (const book of res.data.results.books) {
        previews.push(BookPreview(book));
      }
      console.log(files[0]);
      displayImageMap(files[0], res.data['results']);
      setBookPreviews(previews);
      setIsOpen(true);
      ReactGA.event({
        category: 'Home',
        action: 'Upload API successful'
      });
      reset();
    })
    .catch(err => {
      ReactGA.event({
        category: 'Home',
        action: 'Upload API failure'
      });
      if ("error" in err.response.data) {
        setErrorMessage(err.response.data["error"]);
      }
      else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    });
  }

  function sample() {
      ReactGA.event({
        category: 'Sample',
        action: 'Sample button clicked'
      });
    axios.get(apiUrl + "/sample")
    .then(res => {
      const previews = []
      const data = res.data.results.books

      previews.push(Recommendations("Your AI wingman says...", res.data.results.openai.summary))
      previews.push(Recommendations("Recommendation: ", res.data.results.openai.recommendation))

      for (const book of data.results) {
        previews.push(BookPreview(book));
      }
      displayImageMapUrl(apiUrl + "/sample/example.jpeg", data.results);
      setBookPreviews(previews);
      setIsOpen(true);
      ReactGA.event({
        category: 'Sample',
        action: 'API sample successful'
      });
      reset();
    })
    .catch(err => {
      ReactGA.event({
        category: 'Sample',
        action: 'API sample failure'
      });
      if ("error" in err.response.data) {
        setErrorMessage(err.response.data["error"]);
      }
      else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    });
  }

  return (
    <StyletronProvider value={engine}>
      <BaseProvider theme={DarkTheme}>
        <AddToHomeScreen />
      <Outer>
          <Inner>
          <Card
      overrides={{Root: {style: {width: '400px', textAlign: 'center'}}}}
      headerImage={"https://images.unsplash.com/photo-1545696648-86c761bc5410?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80"}
      title="Shazam for Bookshelves"
       >
      <StyledBody>
      Take a photo of a bookshelf and we'll tell you what books are on it!
        <LocaleProvider locale={fileUploaderLocale}>
          <FileUploader
            overrides={{Root: {style: {paddingTop: '20px'}}}}
            onCancel={reset}
            onDrop={(acceptedFiles, rejectedFiles) => {
              startProgress();
              uploadImage(acceptedFiles);
            }}
            progressMessage={
              isUploading ? `Uploading and Extracting Books! \n Hang tight...` : ''
            }
            errorMessage={errorMessage}
            accept="image/*"
            maxSize={1e7}
            contentMessage={`Take a picture of your bookshelf and upload it here!`}
          /></LocaleProvider>
      </StyledBody>
      <StyledAction>
        <Button
          overrides={{
            BaseButton: { style: { width: "100%" } }
          }}
          onClick = {() => sample()}
        >
         Try Sample! 🚀
        </Button>
      </StyledAction>
    { <Tweet tweetId="1627857007146414082" options={{ theme: "dark", width: "400px" }}/> }
      </Card>
          </Inner>
    </Outer>
    <Drawer
      isOpen={isOpen}
      autoFocus
      onClose={() => setIsOpen(false)}
      size="full"
      anchor="bottom"
    >
       {/* <MobileHeader
          title="Header title"
          // navButton={{
          //   onClick: () => console.log('Nav Button Click'),
          //   label: 'Back',
          // }}
          // actionButtons={[
          //   {
          //     onClick: () => console.log('Check Button Click'),
          //     label: 'Action',
          //   },
          // ]}
        > */}
    <Tabs
      onChange={({ activeKey }) => {
        setActiveKey(activeKey);
      }}
      fill="fixed"
      activeKey={activeKey}
      style={{position: "sticky", top:"0px"}}
    >
    <Tab title="Books: List">{bookPreviews}</Tab>
      <Tab title="Bookshelf: Map">
        {imageMap}
      </Tab>
    </Tabs>
    {/* </MobileHeader> */}
    </Drawer>
      </BaseProvider>
    </StyletronProvider>
  );
}
