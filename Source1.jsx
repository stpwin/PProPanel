app.enableQE();
var project = app.project;

main();

function main() {
  $.writeln("Hello");

  //promptDuplicateClip();

  promptBatchOpacity();

  // var selectedClips = getSelectedClips();
  // for (var i = 0; i < selectedClips.length; i++) {
  //   $.writeln("Selected clip: " + selectedClips[i].name);
  //   //selectedClips[i].inPoint = 0;
  //   // selectedClips[i].projectItem.setStartTime(5);

  //   setLinkedItemTime(selectedClips[i], 0);

  //   $.writeln("start: " + selectedClips[i].start.seconds);
  //   // $.writeln("outPoint: " + selectedClips[i].outPoint.seconds);
  // }
}

function setLinkedItemTime(clip, start, end) {
  if (typeof end == "undefined") {
    end = start + clip.duration.seconds;
  }
  clip.end = end;
  clip.start = start;
  var linkedItems = clip.getLinkedItems();
  if (linkedItems) {
    for (var linkNo = 0; linkNo < linkedItems.numItems; linkNo++) {
      linkedItems[linkNo].end = end;
      linkedItems[linkNo].start = start;
    }
  }
}

function promptDuplicateClip() {
  var value = isValidValue(
    prompt("Enter duplicate count", "5", "Duplicate clip")
  );
  if (value) {
    duplicateClip(value);
  }
}

function promptBatchOpacity() {
  var value = isValidValue(prompt("Enter opacity", "50", "Batch Opacity"));
  if (value) {
    batchOpacitySelected(value);
  }
}

function isValidValue(rawValue) {
  var value = parseInt(rawValue);
  if (!isNaN(value)) {
    return value;
  } else {
    alert("Bad value!");
    return false;
  }
}

function batchOpacitySelected(value) {
  var selectedClips = getSelectedClips();
  for (var i = 0; i < selectedClips.length; i++) {
    $.writeln(
      "Clip: " + selectedClips[i].name + ", " + selectedClips[i].nodeId
    );
    //getComponents(selectedClips[i]);
    setOpacity(selectedClips[i], value);
  }
}

function batchScale(width, height) {}

function batchPosition(x, y) {}

function batchRotation(angle) {}

function batchAnchorPoint(x, y) {}

function setOpacity(trackItem, value) {
  var opacity = getComponentProperty(trackItem, "Opacity", "Opacity");
  if (opacity) {
    $.writeln("Set opacity: " + value);
    $.writeln("is varying: " + opacity.isTimeVarying());
    opacity.setValue(value, true);
  }
}

function getComponentProperty(trackItem, componentName, propertyName) {
  if (!(trackItem && componentName && propertyName)) return;
  for (
    var componentNo = 0;
    componentNo < trackItem.components.numItems;
    componentNo++
  ) {
    if (trackItem.components[componentNo].displayName == componentName) {
      for (
        var propertyNo = 0;
        propertyNo < trackItem.components[componentNo].properties.numItems;
        propertyNo++
      ) {
        // $.writeln(
        //   "Property: " +
        //     trackItem.components[componentNo].properties[propertyNo].displayName
        // );
        if (
          trackItem.components[componentNo].properties[propertyNo]
            .displayName == propertyName
        ) {
          return trackItem.components[componentNo].properties[propertyNo];
        }
      }
    }
  }
  return;
}

function getComponents(trackItem) {
  if (!trackItem) return [];
  for (
    var componentNo = 0;
    componentNo < trackItem.components.numItems;
    componentNo++
  ) {
    $.writeln("Component: " + trackItem.components[componentNo].displayName);
    var properties = trackItem.components[componentNo].properties;
    for (var propertyNo = 0; propertyNo < properties.numItems; propertyNo++) {
      $.writeln("  |_Property: " + properties[propertyNo].displayName);
    }
  }
}

function getFirstSelectedClipWithTrack() {
  var activeSeq = project.activeSequence;
  var videoTracks = activeSeq.videoTracks;
  for (var trackNo = 0; trackNo < videoTracks.numTracks; trackNo++) {
    for (
      var clipNo = 0;
      clipNo < videoTracks[trackNo].clips.numItems;
      clipNo++
    ) {
      var videoClip = videoTracks[trackNo].clips[clipNo];
      if (videoClip.isSelected()) {
        return [videoClip, clipNo, trackNo];
      }
    }
  }
  return;
}

function getSelectedClips() {
  var clips = [];
  var activeSeq = project.activeSequence;
  var videoTracks = activeSeq.videoTracks;
  for (var trackNo = 0; trackNo < videoTracks.numTracks; trackNo++) {
    for (
      var clipNo = 0;
      clipNo < videoTracks[trackNo].clips.numItems;
      clipNo++
    ) {
      var videoClip = videoTracks[trackNo].clips[clipNo];
      if (videoClip.isSelected()) {
        clips.push(videoClip);
      }
    }
  }
  return clips;
}

function duplicateClip(count) {
  var activeSeq = project.activeSequence;
  var videoTracks = activeSeq.videoTracks;
  var selectedClipWithTrackNo = getFirstSelectedClipWithTrack();
  if (!selectedClipWithTrackNo) return;
  var videoClip = selectedClipWithTrackNo[0];
  var trackNo = selectedClipWithTrackNo[1];
  var clipNo = selectedClipWithTrackNo[2];
  var startTime = videoClip.end.seconds;

  //var projectItem = videoClip.projectItem;
  //$.writeln("Start time: " + projectItem.start.seconds);

  for (var c = 0; c < count; c++) {
    videoTracks[trackNo].insertClip(videoClip.projectItem, startTime);
    var curClip = videoTracks[trackNo].clips[clipNo + c + 1];
    var linkedItems = curClip.getLinkedItems();

    startTime = startTime + videoClip.duration.seconds;
    curClip.end = startTime;
    curClip.inPoint = videoClip.inPoint.seconds;
    //curClip.projectItem.setStartTime(videoClip.start.seconds);
    if (linkedItems) {
      for (
        var linkedItemNo = 0;
        linkedItemNo < linkedItems.numItems;
        linkedItemNo++
      ) {
        // linkedItems[linkedItemNo].projectItem.setStartTime(
        //   videoClip.start.seconds
        // );
        linkedItems[linkedItemNo].end = startTime;
        linkedItems[linkedItemNo].inPoint = videoClip.inPoint.seconds;
      }
    }
  }
}
