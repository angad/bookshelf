import './App.css';

import BookPreview from './BookPreview';
import ImageMap from './ImageMap';
import * as React from 'react';
import {FileUploader} from 'baseui/file-uploader';
import axios from 'axios';

import { Client as Styletron } from 'styletron-engine-atomic';
import { Provider as StyletronProvider } from 'styletron-react';
import { DarkTheme, BaseProvider } from 'baseui';
import {Grid, Cell, BEHAVIOR} from 'baseui/layout-grid';
import {useStyletron} from 'baseui';
import { MessageCard } from "baseui/message-card";
import {Card, StyledBody} from 'baseui/card';
import { Tabs, Tab } from "baseui/tabs-motion";
import { Drawer } from "baseui/drawer";
import AddToHomeScreen from '@ideasio/add-to-homescreen-react';
import { Button } from "baseui/button";
// import { MobileHeader } from "baseui/mobile-header";

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
        padding: '.25rem',
      })}
    >
      {children}
    </div>
  );
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

      for (const book of res.data['results']) {
        previews.push(BookPreview(book));
      }
      console.log(files[0]);
      displayImageMap(files[0], res.data['results']);
      setBookPreviews(previews);
      setIsOpen(true);
      reset();
    })
    .catch(err => {
      if ("error" in err.response.data) {
        setErrorMessage(err.response.data["error"]);
      }
      else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    });
  }

  function sample() {
    axios.get(apiUrl + "/sample")
    .then(res => {
      const previews = []
      const data = res.data.results
      console.log(data)

      for (const book of data.results) {
        previews.push(BookPreview(book));
      }
      displayImageMapUrl(apiUrl + "/sample/example.jpeg", data.results);
      setBookPreviews(previews);
      setIsOpen(true);
      reset();
    })
    .catch(err => {
      if ("error" in err.response.data) {
        setErrorMessage(err.response.data["error"]);
      }
      else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    });
  }

function Banner() {
  return (
      <Outer>
      <Grid behavior={BEHAVIOR.fluid}>
        <Cell span={12}>
          <Inner>
          <MessageCard
      // overrides={{Root: {style: {width: '800px'}}}}
      heading="Shazam for Bookshelves"
      paragraph="Click a picture of a bookshelf and find your next read!"
      image={{
        src:
          "https://images.unsplash.com/photo-1593430980369-68efc5a5eb34??ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80"
      }}
    />
          </Inner>
        </Cell>
      </Grid>
    </Outer>
  )
}

  return (
    <StyletronProvider value={engine}>
      <BaseProvider theme={DarkTheme}>
        {Banner()}
        <AddToHomeScreen />
      <Outer>
      <Grid behavior={BEHAVIOR.fluid}>
        <Cell span={12}>
          <Inner>
          <Card
      overrides={{Root: {style: {width: '800px'}}}}
      // headerImage={bookshelfImage}
      title="" >
      <StyledBody>
          <FileUploader
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
          />
      </StyledBody>
      <Outer>
        <Inner>
          <Button shape="pill" onClick={() => sample()}>Try Sample! 🚀</Button>
        </Inner>
      </Outer>
      </Card>
          </Inner>
        </Cell>
      </Grid>
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
      <Tab title="Bookshelf: Map">
        {imageMap}
      </Tab>
    <Tab title="Books: List">{bookPreviews}</Tab>
    </Tabs>
    {/* </MobileHeader> */}
    </Drawer>
      </BaseProvider>
    </StyletronProvider>
  );
}
