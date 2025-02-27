.. _aws-logs-ts:
.. _aws-ts-logs:

******************************************************
Troubleshoot log collection in AWS
******************************************************

.. meta::
  :description: Troubleshoot log collection from your AWS services in Splunk Observability Cloud.

See the following topics when experiencing issues collecting logs from AWS.

.. note::

  See also :ref:`aws-troubleshooting`.

CloudFormation stack was not created
================================================================

You fully control the process of creating the CloudFormation stack, which is executed with the permissions associated with your user. The template contains a lambda function and a role required to forward logs from Cloudwatch and S3 buckets. If any errors occur, AWS displays a specific error message.

To learn more about supported templates, see the :new-page:`README <https://github.com/signalfx/aws-cloudformation-templates>` on GitHub.


I created an integration, but I don't see any logs
================================================================

If you created the integration recently, it might take some time for the logs to appear in your account. The job that makes your logs notify Splunk AWS Log Collector runs every minute, so it might take a short while to subscribe to a new resource. AWS logs delivery inside AWS (to CloudWatch log groups, or to S3 buckets) and AWS lambda triggering can introduce additional delay. Check AWS documentation for more details. 

If you still don't see any logs after 15 minutes, check the IAM policy you've used to set up the AWS connection. We recommend using the :ref:`provided IAM policy <aws-iam-policy>`. If you still don't see the logs, please contact :ref:`our support <support>`.

You can activate debug mode on the log forwarding lambda function: Add ``LOG_LEVEL=DEBUG`` in the :guilabel:`Configuration > Environment variables` section. If you see log forwarding calls fail due to a 503 HTTP error, you might be exceeding logs limit. To fix this, contact :ref:`our support <support>`.


CloudFront access logs are not being collected
================================================================

CloudFront is a global service, and its logs can be stored in any of the standard AWS regions. Each CloudFront instance can have an S3 target bucket to access configured logs. Splunk AWS log collection can only grab the logs if the S3 bucket is located in a region Splunk AWS log collection can access. Use the provided IAM policy to ensure the Splunk Observability Cloud back end has the required permissions.


I don't see logs from some instances
================================================================

Make sure your IAM policy allows access to the instances, their regions, or the regions where they send logs. If the service instance was recently created, it might take up to 15 minutes for the Splunk Observability Cloud back end to start gathering logs from it. 

AWS allows you to configure only one notification of a given kind when a new log file appears, and S3 event files are created. If the bucket where an instance's logs are stored already notifies another lambda function of a file creation, Observability Cloud cannot add its subscription on top of that. You can either remove the pre-existing notification configuration, or narrow it by specifying a prefix and a suffix in such a way that the log files won't be triggering your pre-existing lambda function. If that's not possible, :ref:`contact us <support>` for assistance to modify your AWS architecture to work around the limitation.


I don't see logs from some of my S3 buckets
================================================================

Some AWS services use S3 buckets to store their logs, and sometimes the S3 bucket is located in a different region from the service that produces those logs. In such cases make sure to deploy the ``splunk-aws-logs-collector`` lambda function using the CloudFormation template in all AWS regions where S3 buckets with logs are located.


I have deactivated logs collection, but logs are still gathered by Observability Cloud
==============================================================================================================

It might take up to 15 minutes for the Observability Cloud back end to cancel log subscriptions. There might be additional delays introduced by the AWS logs delivery process.

The back end needs log related permissions to cancel log subscriptions. If log related permissions are removed from the AWS IAM policy (or the entire policy is removed), the back end cannot run the cleanup procedure. Make sure to deactivate log collection on Observability Cloud side first, and clean up on AWS side later.


I deactivated the integration or changed its settings, but logs are still being collected!
===============================================================================================================

If you deactivate a part or all the integration, our back end job will attempt to clear all notifications and subscriptions it has previously created, which might take up to 15 minutes. However, if you also remove IAM permissions, the attempt might fail. 

To stop sending any logs to Observability Cloud, delete the Splunk AWS Logs collector lambda from the region where you wish to stop collecting logs.
