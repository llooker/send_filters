import React, { useCallback, useContext, useEffect } from "react"
import { EmbedProps } from "./types"
import { LookerEmbedSDK, LookerEmbedDashboard } from '@looker/embed-sdk'
import {ExtensionContext, ExtensionContextData,} from "@looker/extension-sdk-react"
import { Button, Heading, Label, ToggleSwitch, FieldText, 
  Fieldset, Slider, Card, theme, SpaceVertical, Box, CardContent, Select, SelectMulti, Grid, FieldRadioGroup
,Status, StatusIntent, Flex, Tooltip, Paragraph
} from "@looker/components"
 
import { EmbedContainer } from './Embed/components/EmbedContainer'
import { InputText } from '@looker/components'
import { background } from "styled-system"
import { initial } from "lodash"

export const AudienceSelector: React.FC<EmbedProps> = () => {

  //Instantiate iframe dashboard via Extension Context (to obtain host) and Looker Embed SDK
  const extensionContext = useContext<ExtensionContextData>(ExtensionContext)
  const hostUrl = extensionContext?.extensionSDK?.lookerHostData?.hostUrl
  LookerEmbedSDK.init(hostUrl)
  const db = LookerEmbedSDK.createDashboardWithId(4)

  //Add dashboard to component state
  const [dashboard, setDashboard] = React.useState<LookerEmbedDashboard>()

  //Callback function which binds the dashboard to the DOM container
  const bindDashboard = useCallback(container => {
    //do you have a container and a host?
    if (container && hostUrl) {
      container.innerHTML = ''
      //Bind the dashboard into the EmbedContainter
      db.appendTo(container)
        //subscribe to all filter change events, sending them to React state
        .on('dashboard:loaded',mangageFilterState)
        .on('dashboard:filters:changed',mangageFilterState)
        .withNext()
        .build()
        .connect()
        //set dashboard in React state
        .then(setDashboard)
        .catch((error: Error) => {
             console.error('Connection error', error)
        })
    }
  }, [])

  //Tracks the state of the dashboard filters
  const [filterState, setFilterState] = React.useState()
  //Obtains just the filter values from the change event for depositing in React state
  const mangageFilterState = (event: any) => {
    setFilterState(event.dashboard.dashboard_filters)
  }

  //Width of fields in the form
  const fieldWidth = 250;

  //Tracks the state of the form components on each change event
  const [formState, setFormState] = React.useState({
     audience_name:""
    ,ga_account_brand: ""
    ,DBM_LINKS: []
    ,ADWORDS_LINKS: []
    ,OPTIMIZE: []
    ,lookback_period:30
    ,duration:"7"
  })


  //Destructures for incremental capture 
  const manageFormState = (id:string,value:any) => {
    setFormState({...formState, [id]:value})
    //special case due to nuance of slider
    if(id=="membership_duration") {
      setsliderState(value)
    }
    if(id=="lookback_period") {
      setlookbackState(value)
    }
  } 
  //Tracks the state for components that natively leverage the onchange event
  const [sliderState, setsliderState] = React.useState(30)
  const [lookbackState, setlookbackState] = React.useState("7")

  //Tracks the success of the most recent send to cloud function
  const [postState, setPostState] = React.useState("");

//submission state
const [submissionState, setsubmissionState] = React.useState("")
const [didSubmit, setdidSubmit] = React.useState(false)
//Handles the data submission to endpoint
  const submit = async (event: any) => {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions: RequestInit = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({
        filterState, formState
      }),
      redirect: 'follow'
    };
    // Performs the call
    fetch("https://kewl1.free.beeceptor.com", requestOptions)
      .then(response => response.json())
      .then(result => setsubmissionState(result['status']))
      .then(e => setdidSubmit(true))
      .catch(error => {console.log('error', error); setsubmissionState('error')});
  }

//Set up a table of brands to use for each of the LOV selectors below
let brandList = [
  { value: 'Aveeno', label: 'Aveeno' },
  { value: 'Neutrogena', label: 'Neutrogena' },
  { value: 'BandAid', label: 'BandAid' },
  { value: 'Benadryl', label: 'Benadryl' },
  { value: 'Benylin', label: 'Benylin' },
  { value: 'Clean and Clear', label: 'Clean and Clear' },
  { value: 'Nicoderm', label: 'Nicoderm' },
  { value: 'Listerine', label: 'Listerine' },
  { value: 'Imodium', label: 'Imodium' },
  { value: 'Pepcid', label: 'Pepcid' },
  { value: 'Johnson\'s Baby', label: 'Johnson\'s Baby' },
  { value: 'Motrin', label: 'Motrin' },
  { value: 'Nicorette', label: 'Nicorette' },
  { value: 'Polysporin', label: 'Polysporin' },
  { value: 'Reactine', label: 'Reactine' },
  { value: 'Rogaine', label: 'Rogaine' },
  { value: 'Tylenol', label: 'Tylenol' },
  { value: 'Multi-Brand', label: 'Multi-Brand' }
];

//Options for the Lookback period
const lookbackPeriodOptions = [
  {
    label: '7 Days',
    value: '7',
  },
  {
    label: '14 Days',
    value: '14',
  },
  {
    label: '30 Days',
    value: '30',
  },
]


let account_ids = [
    { value: 6548511, label: '6548511' },
    { value: 24536442, label: '24536442' },
    { value: 12177048, label: '12177048' },
    { value: 24556558, label: '24556558' },
    { value: 21937847, label: '21937847' },
    { value: 24536447, label: '24536447' },
    { value: 25814349, label: '25814349' },
    { value: 24535977, label: '24535977' },
    { value: 134412268, label: '134412268' },
];



const {audience_name, ga_account_brand } = formState
const isFieldValid = ( audience_name.length && ga_account_brand.length )
const [userInteracted, setuserInteracted] = React.useState(false);

return (
    <>
<Box m="large">
  <Grid columns={1}>
    <Card raised>
      <CardContent>
        <Fieldset legend="Audience Creator" accordion defaultOpen >
          <Grid columns={3}>

              <Card>
                <CardContent>
                  <label>New Audience Name*</label>
                <FieldText 
                  name="audience_name" 
                  validationMessage={(audience_name.length === 0 && userInteracted) ? { type: 'error', message: 'Need a value' }: {} } 
                  onChange={(val)=>{manageFormState('audience_name',val.target.value)}}  
                  width={fieldWidth}
                  onBlur={(val)=>setuserInteracted(true)}
                  />


              <label>Audience Brand*</label>
              <Select label="brand" width={fieldWidth} 
                options={brandList}
                onChange={(val)=>{manageFormState('ga_account_brand',val)}}
              />
                      <Paragraph fontSize="small" variant="secondary">
                    *required fields
                    </Paragraph>

                </CardContent>
               </Card>

               <Card>
                <CardContent>
                <label>DV360 Account</label>
              <SelectMulti label="DV360 Account" width={fieldWidth} 
                options={brandList}
                onChange={(val)=>{manageFormState('DBM_LINKS',val)}}
              />


             <label>Google Ads Account</label>
              <SelectMulti label="Google Ads Account" width={fieldWidth} 
                options={brandList}
                onChange={(val)=>{manageFormState('ADWORDS_LINKS',val)}}
              />

            <label>Optimize Account</label>
              <SelectMulti label="optimizeaccountBrand" width={fieldWidth} 
                options={brandList}
                onChange={(val)=>{manageFormState('OPTIMIZE',val)}}
              />
                </CardContent>
               </Card>

               <Card>
                <CardContent>
                  <label>Membership Duration</label>
                <Slider label="foo" width={fieldWidth} min={1} max={540} value={sliderState} 
                onChange={(val)=>{manageFormState('duration',val.target.value)}} />


                <FieldRadioGroup
                    // description="Activity timeframe considered for audience membership"
                    label="Lookback Period"
                    name="lookback_period"
                    options={lookbackPeriodOptions}
                    value={lookbackState}
                    onChange={(val)=>{manageFormState('lookback_period',val)}}
                  />
                </CardContent>
               </Card>


                <Tooltip content="Audience Name and GA Brand Required">
               <Button disabled={!isFieldValid} onClick={submit} > Submit New Audience </Button>
               </Tooltip>
               { didSubmit ?
               submissionState == "Audience Successfully Created"
                  ? <><Status intent="positive" />Audience Successfully Created</>
                  : <><Status intent="critical" />Error in audience creation</>
               : <></> }
              </Grid>
          </Fieldset>
      </CardContent>
    </Card>
  </Grid>
</Box>
          <EmbedContainer id='myEmbedContainer' ref={bindDashboard} />
    </> 
  )
}
