/* eslint-disable no-mixed-operators */

const calcTimeDiff = (startTime) => {
  const start = startTime.getTime();
  const now = new Date().getTime();
  const timeDiff = Math.abs(now - start) / 1000;
  const days = Math.floor(timeDiff / (3600 * 24));
  const hours = Math.floor((timeDiff - days * 3600 * 24) / 3600);
  const mins = Math.floor((timeDiff - days * 3600 * 24 - hours * 3600) / 60);
  const secs = Math.floor(timeDiff - days * 3600 * 24 - hours * 3600 - mins);

  if (hours) {
    return `${hours} hours and ${mins} minutes ago`;
  }

  if (mins) {
    return `${mins} minutes ago`;
  }

  return `${secs} seconds ago`;
};

const getTime = (date) => {
  const hour = date.getHours();
  const min = date.getMinutes();
  return `${hour}:${`0${min}`.slice(-2)}`;
};

class CompileTimePlugin {
  constructor() {
    this.writeTimerId = null;
    this.doneAt = null;
  }

  writeTime = () => {
    const timeAgo = calcTimeDiff(this.doneAt);
    const now = new Date();

    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(`At ${this.doneAtStr} (${timeAgo}). Now: ${getTime(now)} `);
  };

  apply(compiler) {
    compiler.plugin('watch-run', (watching, callback) => {
      if (this.writeTimerId) {
        clearInterval(this.writeTimerId);
      }
      callback();
    });
    compiler.plugin('done', () => {
      this.doneAt = new Date();
      this.doneAtStr = getTime(this.doneAt);
      this.writeTimerId = setInterval(this.writeTime, 1000);

      process.stdout.write('\n----------\n');
    });
  }
}

module.exports = CompileTimePlugin;
