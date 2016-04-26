Router.route("/faq", {
    name: "faq",
    loadingTemplate: "faqLoading",
    waitOn: function () {
        return Meteor.subscribe("faqQuestions");
    },
    onAfterAction: function () {
        Session.set("currentQuestion", valid(Router.current().params.query.question) ? Router.current().params.query.question : undefined);
    }
});

function questionToFriendlyUrl(question) {
    return question.toLowerCase().split(' ').join('-');
}

Template.faq.events({
    "submit .add-question": function (event, template) {
        event.preventDefault();

        if (!valid(event.target.question)) {
            alert("Ocurrió un error. Por favor intente de nuevo.");
            return false;
        }
        if (event.target.question.value.length <= 0) {
            return false;
        }

        var friendlyUrl = questionToFriendlyUrl(event.target.question.value);

        if (faqQuestions.find({ friendlyUrl: friendlyUrl }).count() > 0) {
            alert("Ya existe una pregunta con el mismo título.");
            return false;
        }

        faqQuestions.insert({
            question: event.target.question.value,
            answer: "",
            friendlyUrl: friendlyUrl
        });

        $("#question").val("");
    },
    "click .save-answer": function (event, template) {
        if (!valid(event.target.dataset.questionid)) {
            alert("Debe especificar una pregunta.");
            return false;
        }
        if (event.target.dataset.questionid.length <= 0) {
            alert("Debe especificar una pregunta.");
            return false;
        }
        console.log($(".trumbowyg-editor").html());
        faqQuestions.update({ _id: event.target.dataset.questionid }, {
            $set: {
                answer: $(".trumbowyg-editor").html()
            }
        });
        alert("Se actualizó la respuesta con éxito.");
    }
});

Template.faq.helpers({
    getQuestions: function () {
        var questions = faqQuestions.find();
        if (!valid(Session.get("currentQuestion"))) {
            Session.set("currentQuestion", questions.count() > 0 ? questions.fetch()[0].friendlyUrl : undefined);
        }
        return questions;
    },
    isFaqEmpty: function (faqQuestions) {
        return faqQuestions.count() <= 0;
    },
    getCurrentQuestion: function () {
        var question = valid(Session.get("currentQuestion")) ? faqQuestions.findOne({ friendlyUrl: Session.get("currentQuestion") }) : undefined;
        return question;
    },
    initContent: function (currentQuestion) {
        Meteor.defer(function () {
            $(".answer img").addClass("img-responsive");
        });
    },
    initEditor: function (currentQuestion) {
        Meteor.defer(function () {
            $('#answer_' + currentQuestion._id).trumbowyg({
                height: 500,
                btnsDef: {
                    image: {
                        dropdown: ['insertImage', 'base64', 'noEmbed'],
                        ico: 'insertImage'
                    }
                },
                btns: [
                    ['viewHTML'],
                    ['undo', 'redo'],
                    ['formatting'],
                    'btnGrp-design',
                    ['link'],
                    ['image'],
                    'btnGrp-justify',
                    'btnGrp-lists',
                    ['foreColor', 'backColor'],
                    ['preformatted'],
                    ['horizontalRule'],
                    ['fullscreen']
                ]
            });
            $(".trumbowyg-editor").html(currentQuestion.answer);
        });
    }
});