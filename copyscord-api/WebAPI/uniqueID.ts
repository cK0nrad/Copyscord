let currentID = 0;

export default class UniqueID {
  static generate(serverId = 0) {
    if (serverId > 2047) {
      return "Server out of range";
    }
    let output = Date.now().toString(2) + serverId.toString(2).padStart(11, "0") + currentID.toString(2).padStart(11, "0");
    this.inc();
    return output;
  }

  static inc() {
    if (currentID === 2047) {
      currentID = 0;
    } else {
      currentID++;
    }
  }
}
