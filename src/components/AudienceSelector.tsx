import React, { useCallback, useContext, useEffect } from "react"
import { EmbedProps } from "./types"
import { LookerEmbedSDK, LookerEmbedDashboard } from '@looker/embed-sdk'
import {ExtensionContext, ExtensionContextData,} from "@looker/extension-sdk-react"
import { Button, Heading, Label, ToggleSwitch, FieldText, 
  Fieldset, Slider, Card, theme, SpaceVertical, Box, CardContent, Select, Grid, FieldRadioGroup
,Status, StatusIntent, Flex
} from "@looker/components"
 
import { EmbedContainer } from './Embed/components/EmbedContainer'
import { InputText } from '@looker/components'
import { background } from "styled-system"

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
        .on('dashboard:filters:changed',mangageFilterState)
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
  const [formState, setFormState] = React.useState({})
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
  const [sliderState, setsliderState] = React.useState(0)
  const [lookbackState, setlookbackState] = React.useState(0)

  //Tracks the success of the most recent send to cloud function
  const [postState, setPostState] = React.useState("");

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
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
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

//Set form defaults on initial load
useEffect(() => {
  setsliderState(30);
  setlookbackState(7);
}, []);


/// fields we actually need in the UI:
// Name for the audience -- 
// Brand (hardcoded list of brands) one and only one but "multibrand" will need to be a list member too -- 
// DV360 Account (hardcoded list of brands) -- 
// Google Ads Account (hardcoded list of brands) -- 
// Optimize Account (hardcoded list of brands)
// plarform ids (multi-select minimum of one value)
// Lookback period (1 of 3 options) (7, 14, 30)
// Membership Duration (number between 1 and 540 inclusive) range slider? default to 45?
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
                <FieldText 
                  label="New Audience Name" 
                  name="audience_name" onChange={(val)=>{manageFormState('audience_name',val.target.value)}}  width={fieldWidth} />


              <label>Target Brand</label>
              <Select label="brand" width={fieldWidth} 
                options={brandList}
                onChange={(val)=>{manageFormState('brand',val)}}
              />

                <label>Platform IDs</label>
              <Select label="platformid" width={fieldWidth} 
                options={brandList}
                onChange={(val)=>{manageFormState('platform_ids',val)}}
              />

                </CardContent>
               </Card>

               <Card>
                <CardContent>
                <label>DV360 Brand</label>
              <Select label="DV360Brand" width={fieldWidth} 
                options={brandList}
                onChange={(val)=>{manageFormState('dv360brand',val)}}
              />


             <label>Google Ads Account</label>
              <Select label="googleadsaccountBrand" width={fieldWidth} 
                options={brandList}
                onChange={(val)=>{manageFormState('ga_account_brand',val)}}
              />

            <label>Optimize Account</label>
              <Select label="optimizeaccountBrand" width={fieldWidth} 
                options={brandList}
                onChange={(val)=>{manageFormState('optimize_account_brand',val)}}
              />
                </CardContent>
               </Card>

               <Card>
                <CardContent>
                  <label>Membership Duration</label>
                <Slider label="foo" width={fieldWidth} min={1} max={540} value={sliderState} 
                onChange={(val)=>{manageFormState('membership_duration',val.target.value)}} />


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



               <Button onClick={submit} > Submit New Audience </Button>







              {/* <Status intent="critical" />
              <Status intent="inform" />
              <Status intent="neutral" />
              <Status intent="positive" /> */}
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
