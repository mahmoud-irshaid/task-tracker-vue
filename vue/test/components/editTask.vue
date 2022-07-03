<template>
  <v-dialog v-model="toggle" persistent width="1000">
    <v-card class="pt-6 pb-2">
      <v-row class="d-flex justify-space-between mx-9 my-1">
        <h1>Edit Task</h1>
        <v-btn
          class="mx-2 rotate"
          fab
          dark
          small
          color="primary"
          @click="close"
        >
          <v-icon dark> mdi-plus </v-icon>
        </v-btn>
      </v-row>
      <v-form @submit.prevent="onSubmit" class="mt-6 overflow-hidden">
        <v-row justify="space-around">
          <v-col cols="11" md="5">
            <v-text-field
              v-model="EditTask.name"
              label="Task Name"
              required
            ></v-text-field>

            <v-textarea
              filled
              v-model="EditTask.description"
              label="Enter decription"
              required
            ></v-textarea>

            <v-divider inset></v-divider>

            <v-select
              v-model="EditTask.type"
              :items="['Instant', 'Scheduled']"
              item-text="state"
              item-value="abbr"
              label="Task Type"
              persistent-hint
              return-object
              single-line
            ></v-select>

            <v-checkbox
              v-model="EditTask.claimed"
              :label="`Claimed`"
            ></v-checkbox>
            <v-col cols="12">
              <v-autocomplete
                v-model="friends"
                :items="people"
                filled
                chips
                color="blue-grey lighten-2"
                label="Select"
                item-text="user"
                multiple
                return-object
              >
                <template v-slot:selection="data">
                  <v-chip
                    v-bind="data.attrs"
                    :input-value="data.selected"
                    close
                    @click:close="remove(data.item)"
                  >
                    {{ data.item.user }}
                  </v-chip>
                </template>
                <template v-slot:item="data">
                  <template v-if="typeof data.item !== 'object'">
                    <v-list-item-content
                      v-text="data.item.user"
                    ></v-list-item-content>
                  </template>
                  <template v-else>
                    <v-list-item-content>
                      <v-list-item-title
                        v-html="data.item.user"
                      ></v-list-item-title>
                    </v-list-item-content>
                  </template>
                </template>
              </v-autocomplete>
            </v-col>
            <h5>Priority</h5>
            <v-radio-group v-model="EditTask.priority">
              <v-row class="d-flex justify-space-between align-start">
                <v-radio
                  v-for="n in ['Low', 'Meduim', 'High']"
                  :key="n"
                  :label="`${n}`"
                  :value="n"
                ></v-radio>
              </v-row>
            </v-radio-group>

            <v-textarea
              filled
              v-model="EditTask.priorityImpact"
              label="Enter Priority Impact"
              required
            ></v-textarea>
          </v-col>

          <v-divider vertical></v-divider>

          <v-col cols="11" md="5">
            <h5>Severity</h5>
            <v-radio-group v-model="EditTask.severity">
              <v-row class="d-flex justify-space-between align-start">
                <v-radio
                  v-for="n in ['Low', 'Meduim', 'High']"
                  :key="n"
                  :label="`${n}`"
                  :value="n"
                ></v-radio>
              </v-row>
            </v-radio-group>

            <v-textarea
              filled
              v-model="EditTask.severityImpact"
              label="Enter Severity Impact"
              required
            ></v-textarea>

            <v-divider inset></v-divider>

            <v-row class="mt-5">
              <v-col cols="11" sm="6">
                <v-row class="d-flex justify-space-between">
                  <v-col>
                    <v-menu
                      ref="menu"
                      v-model="menu2"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      :return-value.sync="time"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="EditTask.dueTime"
                          label="Picker in menu"
                          prepend-icon="mdi-clock-time-four-outline"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-time-picker
                        v-if="menu2"
                        v-model="EditTask.dueTime"
                        full-width
                        @click:minute="$refs.menu.save(time)"
                      ></v-time-picker>
                    </v-menu>
                  </v-col>
                </v-row>
              </v-col>

              <v-col cols="11" sm="6">
                <v-menu
                  ref="menu"
                  v-model="menu"
                  :close-on-content-click="false"
                  :return-value.sync="dates"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-combobox
                      v-model="EditTask.dueDate"
                      chips
                      small-chips
                      label="Multiple picker in menu"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-combobox>
                  </template>
                  <v-date-picker v-model="EditTask.dueDate" no-title scrollable>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="menu = false">
                      Cancel
                    </v-btn>
                    <v-btn text color="primary" @click="$refs.menu.save(dates)">
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </v-col>
            </v-row>

            <template>
              <v-row>
                <v-col>
                  <v-menu
                    ref="menu"
                    v-model="menu3"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    :return-value.sync="time"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="EditTask.estTime"
                        label="Picker in menu"
                        prepend-icon="mdi-clock-time-four-outline"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-time-picker
                      v-if="menu3"
                      v-model="EditTask.estTime"
                      full-width
                      @click:minute="$refs.menu.save(time)"
                    ></v-time-picker>
                  </v-menu>
                </v-col>
              </v-row>
            </template>

            <v-text-field
              v-model="EditTask.tags"
              label="Tags"
              required
              class="my-6"
            ></v-text-field>

            <vcontainer class="d-flex justify-end">
              <v-btn type="submit" elevation="2" class="green"> Submit </v-btn>
            </vcontainer>
          </v-col>
        </v-row>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'EditTask',
  components: {},
  props: {
    toggle: Boolean,
    editTask: Object,
    assigned: Array,
  },
  data() {
    return {
      time: null,
      time2: null,
      menu: false,
      menu2: false,
      menu3: false,
      dates: [],
      autoUpdate: true,
      isUpdating: false,
      people: [
        { user: 'Sandra Adams' },
        { user: 'Ali Connors' },
        { user: 'Trevor Hansen' },
        { user: 'Tucker Smith' },
      ],
      //  oldpeople: [],
      EditTask: {
        _id: this.editTask._id,
        name: this.editTask.name,
        description: this.editTask.description,
        type: this.editTask.type,
        assigneeName: this.editTask.assigneeName,
        claimed: this.editTask.claimed,
        priority: this.editTask.priority,
        priorityImpact: this.editTask.priorityImpact,
        severity: this.editTask.severity,
        severityImpact: this.editTask.severityImpact,
        dueDate: this.editTask.dueDate,
        dueTime: this.editTask.dueTime,
        estTime: this.editTask.estTime,
        tags: this.editTask.tags,
        checked: this.editTask.checked,
      },
      friends: [],
    }
  },

  methods: {
    onSubmit() {
      this.$store.commit('editTask', {
        EditTask: this.EditTask,
        friends: this.friends,
      })
      this.$emit('close')
    },
    close() {
      this.$emit('close')
    },
    remove(item) {
      this.friends = this.friends.filter((i) => i.user !== item.name)
      // const index = this.oldpeople.indexOf(item.name)
      //if (index >= 0) this.oldpeople.splice(index, 1)
    },
    addNewAssignee() {
      this.friends = [
        ...this.friends,
        //this.oldpeople[this.oldpeople.length - 1],
      ]
    },
  },

  watch: {
    isUpdating(val) {
      if (val) {
        setTimeout(() => (this.isUpdating = false), 3000)
      }
    },
  },
  watch: {
    assigned(old, newValue) {
      this.friends = this.assigned
      // this.friends.map((i) => this.oldpeople.push(i.user))
    },
  },
}
</script>
<style scoped>
.rotate {
  transform: rotateZ(45deg);
}
</style>
