function init() {
    var selector = d3.select("#selDataset");
    d3.json("data/samples.json").then((data) => {
        data.names.forEach((name)=> {
            selector
            .append("option")
            .text(name)
            .property("value", name);
    });
    createDemographics(data.names[0]);
    createChart(data.names[0]); 
});
};
function createDemographics(id){
    d3.json("data/samples.json").then((data) => {
        var metadata= data.metadata;
        var filteredId = metadata.filter(d => d.id.toString() === id);
        showDemographics(filteredId);
    
    });
}  
function showDemographics(metadata){
    demographics = d3.select("#sample-metadata")
    demographics.html('');
    Object.entries(metadata[0]).forEach(([key, value]) => {
        console.log(key);
        demographics.append("h5").text(`${key} : ${value}`)
    })
}

function createChart(id){
    d3.json("data/samples.json").then((data) => {
        var filtered = data.samples.filter(d => d.id.toString() === id)[0];
        var toptenOTU = filtered
                        .otu_ids.slice(0, 10)
                        .reverse()
                        .sort(function(a,b){return b-a;})
                        .map(otu => "OTU"+ otu)
        var toptenSample= filtered
                        .sample_values
                        .slice(0, 10)
                        .reverse()
                        .sort(function(a,b){return a-b;});
        var labels = filtered.otu_labels.slice(0, 10); 
        
        //Build Bar charts     
        var trace = {
            x: toptenSample,
            y: toptenOTU,
            text: labels,
            marker: {color: 'rgb(106, 83, 184)'},
            type:"bar",
            orientation: "h"
         };
         var layout = {
             title: "<b>Top ten OTUs</b>",
             height: 500,
		  	 width: 600,
             "titlefont": {
                "size": 20
              },
             yaxis: {
                 tickmode: "linear",
             },
             margin: {
                l: 100,
                r: 100,
                t: 120,
                b: 30
            }
         };
         Plotly.newPlot("bar", [trace], layout)
    
        //Build Bubble charts
        var trace1 = {
           x: filtered.otu_ids,
           y: filtered.sample_values,
           text: filtered.otu_labels,
           mode: "markers",
           marker: {
            size: filtered.sample_values,
            color:filtered.otu_ids,
            colorscale: "Earth"
            },
           
        };
        var bubble_layout = {
            title: "<b>Bubble Chart OTU id vs Sample values</b>",
            xaxis: {title: "OTU IDs"},
            height : 600,
            width: 1000
        }
        Plotly.newPlot(bubble, [trace1], bubble_layout)
        
        // Build guage chart
        var metadata = data.metadata.filter(d => d.id.toString() === id)[0];
        var wfreq = metadata.wfreq;
        if (wfreq == null) {
            wfreq = 0;
        }
        var data = [
            {
                domain: { x: [0, 1], y: [0, 1]  },            
                value: parseFloat(wfreq),
                title: '<b>Belly Button Washing Frequency</b><br>Scrubs per Week<br><br>',
		  	    height: 600,
		  	    width: 600,
                type: "indicator",
                mode: "gauge+number",
                gauge: { axis: { range: [0, 9] },
                bar: { color: 'rgba(8,29,88,0)' },
                   steps: [
                    { range: [0, 1], color: 'rgb(255,255,217)' },
                    { range: [1, 2], color: 'rgb(237,248,217)' },
                    { range: [2, 3], color: 'rgb(199,233,180)' },
                    { range: [3, 4], color: 'rgb(127,205,187)' },
                    { range: [4, 5], color: 'rgb(65,182,196)' },
                    { range: [5, 6], color: 'rgb(29,145,192)' },
                    { range: [6, 7], color: 'rgb(34,94,168)' },
                    { range: [7, 8], color: 'rgb(37,52,148)' },
                    { range: [8, 9], color: 'rgb(8,29,88)' }
                  ]}
            }
        ];
        
        var layout = { width: 600, height: 500, margin: { t: 10, b: 0 },
                        };
        Plotly.newPlot('gauge', data, layout);
});
}

function optionChanged(id) {
    console.log("In OptionChanged "+ id);
    createDemographics(id);
    createChart(id);
   };

init();