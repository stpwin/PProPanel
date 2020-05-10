app.enableQE();
var project = app.project;

$._my_functions = {
  evalFile : function(path) {
		try {
			$.evalFile(path);
      $.writeln(path)
		} catch (e) {alert("Exception:" + e);}
	},
	evalFootages: function(footagesFolderPath) {
		var folder = new Folder(footagesFolderPath);
		if (folder.exists) {
      return folder.getFiles("*.txt");
		}
	},
  saveConfig: function(extensionPath, fileAvailable){
    // $.writeln(extensionPath + "\\test.json");
    var configFile = File(extensionPath + "\\config.json");
    configFile.open("w");
    var decoded = JSON.parse(fileAvailable);
    var jsonData = {fileAvailable: decoded};
    var encoded = JSON.stringify(jsonData);
    configFile.write(encoded);
    configFile.close();
  },
  setLinkedItemTime: function(clip, start, end) {
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
  },

  promptDuplicateClip: function() {
    var value = $._my_functions.isValidValue(
      prompt("Enter duplicate count", "5", "Duplicate clip")
    );
    if (value) {
      $._my_functions.duplicateClip(value);
    }
  },

  promptBatchScale: function() {
    var scale = $._my_functions.isValidValue(
      prompt("Enter scale", "100", "Batch scale")
    );
    if (scale) {
      $._my_functions.batchScale(scale);
    }
  },

  promptBatchOpacity: function() {
    var value = $._my_functions.isValidValue(prompt("Enter opacity 0-100", "50", "Batch Opacity"));
    if (value > -1) {
      $._my_functions.batchOpacity(value);
    }
  },

  promptBatchRotation: function() {
    var value = $._my_functions.isValidValue(prompt("Enter rotation angle", "180", "Batch Rotation"));
    $._my_functions.batchRotation(value);
  },

  promptBatchPosition: function() {
    var x = $._my_functions.isValidValue(prompt("Enter x", "180", "Batch Position"));
    var y = $._my_functions.isValidValue(prompt("Enter y", "180", "Batch Position"));
    $._my_functions.batchPosition(x, y);
  },

  batchOpacity: function(value) {
    var selectedClips = $._my_functions.getSelectedClips();
    for (var i = 0; i < selectedClips.length; i++) {
      $.writeln(
        "Clip: " + selectedClips[i].name + ", " + selectedClips[i].nodeId
      );
      //getComponents(selectedClips[i]);
      $._my_functions.setOpacity(selectedClips[i], value);
    }
  },

  batchScale: function(value) {
    var selectedClips = $._my_functions.getSelectedClips();
    for (var i = 0; i < selectedClips.length; i++) {
      $.writeln(
        "Clip: " + selectedClips[i].name + ", " + selectedClips[i].nodeId
      );
      $._my_functions.setScale(selectedClips[i], value);
    }
  },

  batchPosition: function(x, y) {
    var selectedClips = $._my_functions.getSelectedClips();
    for (var i = 0; i < selectedClips.length; i++) {
      $.writeln(
        "Clip: " + selectedClips[i].name + ", " + selectedClips[i].nodeId
      );
      $._my_functions.setPosition(selectedClips[i], x, y);
    }
  },

  batchRotation: function(angle) {
    var selectedClips = $._my_functions.getSelectedClips();
    for (var i = 0; i < selectedClips.length; i++) {
      $.writeln(
        "Clip: " + selectedClips[i].name + ", " + selectedClips[i].nodeId
      );
      $._my_functions.setRotation(selectedClips[i], angle);
    }
  },

  batchAnchorPoint: function(x, y) {},

  setOpacity: function(trackItem, value) {
    var opacity = $._my_functions.getComponentProperty(trackItem, "Opacity", "Opacity");
    if (opacity) {
      $.writeln("Set opacity: " + value);
      $.writeln("is varying: " + opacity.isTimeVarying());
      opacity.setValue(value, true);
    }
  },

  setScale: function(trackItem, value) {
    var scale = $._my_functions.getComponentProperty(trackItem, "Motion", "Scale");
    if (scale) {
      $.writeln("Set scale: " + value);
      $.writeln("is varying: " + scale.isTimeVarying());
      scale.setValue(value, true);
    }
  },

  setRotation: function(trackItem, value) {
    var rotation = $._my_functions.getComponentProperty(trackItem, "Motion", "Rotation");
    if (rotation) {
      $.writeln("Set rotation: " + value);
      $.writeln("is varying: " + rotation.isTimeVarying());
      rotation.setValue(value, true);
    }
  },

  setPosition: function(trackItem, x, y) {
    var position = $._my_functions.getComponentProperty(trackItem, "Motion", "Position");
    if (position) {
      $.writeln("Set position: x=" + x + ", y=" + y);
      $.writeln("is varying: " + position.isTimeVarying());
      position.setValue([x, y], true);
    }
  },

  isValidValue: function(rawValue) {
    var value = parseInt(rawValue);
    if (!isNaN(value)) {
      return value;
    } else {
      alert("Bad value!");
      return false;
    }
  },

  getComponentProperty: function(trackItem, componentName, propertyName) {
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
  },

  getComponents: function(trackItem) {
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
  },

  getFirstSelectedClipWithTrack: function() {
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
  },

  getSelectedClips: function() {
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
  },

  duplicateClip: function(count) {
    var activeSeq = project.activeSequence;
    var videoTracks = activeSeq.videoTracks;
    var selectedClipWithTrackNo = $._my_functions.getFirstSelectedClipWithTrack();
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
}
