(function() {
    new Vue({
        el: "#main",
        data: {
            heading: "IMAGE BOARD",
            images: null,
            classMainContainer: "main-container",
            classContainer: "container",
            classPicture: "picture",
            classTitle: "title"
        },
        created: function() {
            console.log("created");
        },
        mounted: function() {
            console.log("mounted");
            var vueInstance = this;
            axios
                .get("/images")
                .then(function(results) {
                    console.log("results.data: ", results.data);
                    vueInstance.images = results.data;
                })
                .catch(function(err) {
                    console.log("err: ", err);
                });
        }
    });
})();

// (function() {
//     window.app = new Vue({
//         el: "#main",
//         data: {
//             heading: "Welcome!",
//             greetee: "kitty",
//             className: "pretty",
//             url: "spice.academy",
//             candy: null
//         },
//         created: function() {
//             console.log("created");
//         },
//         mounted: function() {
//             console.log("mounted");
//             var vueInstance = this;
//             axios
//                 .get("/candy")
//                 .then(function(res) {
//                     console.log(res.data);
//                     vueInstance.candy = res.data;
//                 })
//                 .catch(function(err) {});
//         },
//         updated: function() {
//             console.log("updated");
//         },
//         methods: {
//             sayHello: function() {
//                 console.log("Hello, " + this.greetee);
//             },
//             changeName: function(name) {
//                 for (var i = 0; this.candy.length; i++)
//                     if (this.candy[i].name == name) {
//                         this.candy[i].name = "baci";
//                     }
//             }
//         }
//     });
// })();
