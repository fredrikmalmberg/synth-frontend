<template>
  <v-container v-if="this.bankList" class="fill-height">
    <v-row class="topbar">
      <h1>Fluid Synth</h1>
      <v-btn
        class="shutdownButton"
        right
        icon="mdi-power"
        color="secondary"
        @click="this.shutdownSynth"
      ></v-btn>
    </v-row>
    <v-row class="statusBar">
      <v-col cols="12">
        Current bank
        <h2 v-if="this.currentBankName">
          {{ this.currentBankName.split('.')[0] }} ({{ this.currentBankNumber + 1 }}/{{
            this.bankList.length
          }})
        </h2>
        <div v-else>Loading..</div>

        Current patch
        <div v-if="this.currentPatchName">
          <h2>
            {{ this.currentPatchName }} ({{ this.currentPatchNumber + 1 }}/{{
              this.patchList.length
            }})
          </h2>
        </div>
        <div v-else>Loading..</div>
      </v-col>
    </v-row>
    <v-row class="settings">
      
      <v-col cols="12">
        Synth Settings
        <div v-for="(item, index) in this.settingsArr" v-bind:key="index">
          {{ item[0].split('.')[0].toUpperCase()}} {{item[0].split('.')[1].toUpperCase() }}:
          
          <input class="slider"
            type="range"
            @change="setSettingValue(item[0])"
            min="0"
            max="1"
            step="0.05"
            v-model="item[1]"
          /> <b>{{ item[1] }}</b>
        </div>
      </v-col>
    </v-row>
    <v-row class="selector">
      <v-select
        v-model="select"
        label="Select Patch"
        :items="this.patchList"
        variant="underlined"
      ></v-select>
    </v-row>
    <v-row class="selector">
      <v-select
        v-model="selectB"
        label="Select Bank"
        :items="this.bankList"
        variant="underlined"
      ></v-select>
    </v-row>
  </v-container>
  <v-container v-else> Big Loader... </v-container>
</template>

<script>
import {
  getData,
  selectBank,
  selectPatch,
  shutdown,
  getSetting,
  setSetting,
} from "../fluidIntegration.js";
export default {
  name: "SynthController",
  data() {
    return {
      select: null,
      selectB: null,
      reverbSlider: null,
      patchList: null,
      patchKeys: null,
      bankList: null,
      currentPatchName: null,
      currentPatchNumber: null,
      currentBankName: null,
      currentBankNumber: null,
      reverb: null,
      settingsArr: [
        ["reverb.level", 0.5],
        ["reverb.width", 0.2],
        ["reverb.room-size", 0.5],
      ],
    };
  },
  mounted() {
    getData()
      .then((response) => response.json())
      .then(this.setAllValuesFromData);
    this.getSettingValues();
  },
  watch: {
    select(newValue) {
      console.log(newValue[0]);
      this.currentPatchName = null;
      this.currentPatchNumber = null;
      selectPatch(newValue[0] - 1)
        .then((response) => response.json())
        .then(this.setPatchFromData);
      this.getSettingValues();
    },
    selectB(newValue) {
      let bankIdx = this.bankList.findIndex((el) => el === newValue);
      this.patchList = null;
      this.patchKeys = null;
      this.currentPatchName = null;
      this.currentPatchNumber = null;
      this.currentBankName = null;
      this.currentBankNumber = null;
      selectBank(bankIdx)
        .then((response) => response.json())
        .then(this.setBankFromData);
    },
  },
  methods: {
    getSettingValues() {
      this.settingsArr.forEach((element) => {
        this.getSettingValue(element[0]);
      });
    },
    getSettingValue(option) {
      let idx = this.settingsArr.findIndex((el) => el[0] === option);
      getSetting(option)
        .then((response) => response.json())
        .then((newValue) => (this.settingsArr[idx][1] = newValue))
        .then(() =>
          console.log(
            option + " updated from API to be: " + this.settingsArr[idx][1]
          )
        );
    },

    setSettingValue(option) {
      console.log("changed slider for " + option);
      let newValue = this.settingsArr.find((el) => el[0] === option)[1];
      setSetting(option, newValue).then(() => this.getSettingValue(option));
    },
    shutdownSynth() {
      console.log("shutting down");
      shutdown();
    },
    setAllValuesFromData(data) {
      this.patchList = data[0];
      this.patchKeys = Array.from(Array(this.patchList.length).keys());
      this.bankList = data[1];
      this.currentPatchNumber = data[2];
      this.currentPatchName =
        this.patchList[this.currentPatchNumber][1].slice(2);
      this.currentBankName = data[3];
      this.currentBankNumber = data[4];
    },
    setPatchFromData(data) {
      console.log(data);
      this.currentPatchNumber = data[2];
      this.currentPatchName =
        this.patchList[this.currentPatchNumber][1].slice(2);
    },
    setBankFromData(data) {
      this.patchList = data[0];
      this.patchKeys = Array.from(Array(this.patchList.length).keys());
      this.currentPatchNumber = data[2];
      this.currentPatchName =
        this.patchList[this.currentPatchNumber][1].slice(2);
      this.currentBankName = data[3];
      this.currentBankNumber = data[4];
    },
    setBank(change) {
      let changeTo = change + this.currentBankNumber;
      console.log("changeto", changeTo);
      if (changeTo < 0) {
        changeTo = this.bankList.length - 1;
        console.log("triggered", changeTo);
      }
      if (changeTo > this.bankList.length - 1) {
        changeTo = 0;
      }
      this.patchList = null;
      this.patchKeys = null;
      this.currentPatchName = null;
      this.currentPatchNumber = null;
      this.currentBankName = null;
      this.currentBankNumber = null;
      selectBank(changeTo)
        .then((response) => response.json())
        .then(this.setBankFromData);
    },
  },
};
</script>
<style>
.statusBar {
  height: 20%;
  display: block;
  margin-top: 70px;
}
.bankSelector {
  width: 100%;
}
.selector {
  width: 80%;
  margin-left: 10%;
}
.topbar {
  background-color: rgb(95, 95, 156);
  color: white;
  padding: 10px;
}
.shutdownButton {
  position: absolute;
  right: 13px;
}
.bankButton {
  width: 45%;
  height: 70px;
  margin: 5% 0% 0% 5%;
}
.slider {
  width: 80%;
    margin-left: 5%;
    border: solid 2px #5f5f9c;
    border-radius: 8px;
    height: 7px;
    outline: none;
    appearance: none;
}

.slider::-webkit-slider-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  appearance: none;
  cursor: ew-resize;
  background: #00d2be;
}
</style>
