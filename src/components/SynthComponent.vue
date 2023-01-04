<template>
  <v-container v-if="this.bankList" class="fill-height">
    <v-row class="statusBar">
      <v-col cols="12">
        <h3>Synth Info</h3>
        Current bank:
        <div v-if="this.currentBankName">
          {{ this.currentBankName }} ({{ this.currentBankNumber + 1 }}/{{
            this.bankList.length
          }})
        </div>
        <div v-else>Loading..</div>
        <br />
        Current patch:
        <div v-if="this.currentPatchName">
          {{ this.currentPatchName }} ({{ this.currentPatchNumber + 1 }}/{{
            this.patchList.length
          }})
        </div>
        <div v-else>Loading..</div>
      </v-col>
    </v-row>
    <v-row class="bankSelector">
      <v-col v-if="this.bankList" cols="12">
        <v-btn @click="setBank(1)" width="50%" height="70">Bank up</v-btn
        ><v-btn @click="setBank(-1)" width="50%" height="70">Bank down</v-btn>
      </v-col>
    </v-row>
    <v-row class="selector">
      <v-select
        v-model="select"
        label="Select"
        :items="this.patchList"
        variant="underlined"
      ></v-select>
      <label for="cars">Choose a car:</label>

      <select name="Patch" id="patch">
        <option value="volvo">Volvo</option>
        <option value="saab">Saab</option>
        <option value="mercedes">Mercedes</option>
        <option value="audi">Audi</option>
      </select>
    </v-row>
  </v-container>
  <v-container v-else> Big Loader... </v-container>
</template>

<script>
import { getData, selectBank, selectPatch } from "../fluidIntegration.js";
export default {
  name: "SynthController",
  data() {
    return {
      select: null,
      patchList: null,
      patchKeys: null,
      bankList: null,
      currentPatchName: null,
      currentPatchNumber: null,
      currentBankName: null,
      currentBankNumber: null,
      promise: null,
    };
  },
  mounted() {
    getData()
      .then((response) => response.json())
      .then(this.setAllValuesFromData);
  },
  watch: {
    select(newValue) {
      console.log(newValue[0]);
      this.currentPatchName = null;
      this.currentPatchNumber = null;
      selectPatch(newValue[0] - 1)
        .then((response) => response.json())
        .then(this.setPatchFromData);
    },
  },
  methods: {
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
<style scoped>
.statusBar {
  height: 50%;
  display: block;
}
.bankSelector {
  position: absolute;
  bottom: 120px;
  width: 100%;
}
.selector {
  position: absolute;
  bottom: 50px;
  width: 100%;
}
</style>
