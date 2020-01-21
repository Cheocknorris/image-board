(function() {
    new Vue({
        el: "#main",
        data: {
            heading: "IMAGE BOARD",
            images: [],
            title: "",
            description: "",
            username: "",
            file: null,
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
        },

        methods: {
            handleClick: function(e) {
                e.preventDefault();
                console.log("this: ,", this);
                // this lets us see what was typed in the input field
                // we need to use formData to send a file to the server
                var formData = new FormData();
                formData.append("title", this.title);
                formData.append("description", this.description);
                formData.append("username", this.username);
                formData.append("file", this.file);
                // if I try to console.log formData, i'll get an empty objet

                var vueInstance = this;

                axios
                    .post("/upload", formData)
                    .then(function(resp) {
                        console.log("resp from post/upload: ", resp);
                        vueInstance.images.unshift(resp.data[0]);
                    })
                    .catch(err => {
                        console.log("err in resp/upload: ", err);
                    });
            },

            handleChange: function(e) {
                console.log("haddleChange is running");
                console.log("file", e.target.files[0]);
                this.file = e.target.files[0];
            }
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
